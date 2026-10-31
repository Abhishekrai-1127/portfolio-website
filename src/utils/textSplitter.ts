// DOM-aware text splitter utility to replace GSAP SplitText without breaking words or nested tags
export class TextSplitter {
  chars: Element[] = [];
  words: Element[] = [];
  lines: Element[] = [];
  elements: Element[] = [];
  selector: string | Function;
  private originalHTML: Map<Element, string> = new Map();

  constructor(
    target: string | Element | NodeListOf<Element> | Element[],
    vars?: { type?: string; linesClass?: string }
  ) {
    const type = vars?.type || "chars,words,lines";
    const linesClass = vars?.linesClass || "split-line";

    let elements: Element[] = [];
    if (typeof target === "string") {
      elements = Array.from(document.querySelectorAll(target));
    } else if (target instanceof NodeList) {
      elements = Array.from(target);
    } else if (Array.isArray(target)) {
      elements = target;
    } else if (target) {
      elements = [target];
    }

    this.selector = typeof target === "string" ? target : "";
    this.elements = elements;

    const wantChars = type.includes("chars");
    const wantWords = type.includes("words");
    const wantLines = type.includes("lines");

    elements.forEach((element) => {
      this.originalHTML.set(element, element.innerHTML);

      if (linesClass === "split-h2") {
        // Single-line hero role text (e.g. .landing-h2-1, .landing-h2-info)
        const text = (element.textContent || "").trim();
        const wrapper = document.createElement("div");
        wrapper.className = linesClass;
        text.split("").forEach((ch) => {
          const span = document.createElement("span");
          span.className = "split-char";
          span.style.display = "inline-block";
          span.innerHTML = ch === " " ? "&nbsp;" : ch;
          wrapper.appendChild(span);
        });
        element.innerHTML = "";
        element.appendChild(wrapper);
        this.chars.push(...Array.from(element.querySelectorAll(".split-char")));
        this.lines.push(wrapper);
        return;
      }

      if (wantWords && !wantChars && wantLines) {
        // Paragraph mode: split into words, then group into visual lines synchronously
        this.splitParagraphIntoLinesAndWords(element, linesClass);
      } else if (wantChars) {
        // Heading / title mode: preserve <br> and child spans, wrap words with nowrap so words never break mid-word
        this.splitNodePreserveStructure(element, true);
        if (wantLines) {
          this.wrapVisualLinesForHeading(element, linesClass);
        }
      } else if (wantWords) {
        this.splitNodePreserveStructure(element, false);
      }
    });
  }

  private splitParagraphIntoLinesAndWords(element: Element, linesClass: string) {
    const text = (element.textContent || "").trim().replace(/\s+/g, " ");
    if (!text) return;

    const rawWords = text.split(" ");
    element.innerHTML = "";

    const wordSpans: HTMLElement[] = [];
    rawWords.forEach((w, idx) => {
      const span = document.createElement("span");
      span.className = "split-word";
      span.style.display = "inline-block";
      span.textContent = w;
      element.appendChild(span);
      wordSpans.push(span);
      if (idx < rawWords.length - 1) {
        element.appendChild(document.createTextNode(" "));
      }
    });

    // Measure natural line breaks synchronously BEFORE any GSAP transforms run
    const lines: HTMLElement[][] = [];
    let currentLine: HTMLElement[] = [];
    let currentTop: number | null = null;

    wordSpans.forEach((span) => {
      const top = span.getBoundingClientRect().top;
      if (currentTop === null || Math.abs(top - currentTop) <= 6) {
        currentLine.push(span);
        if (currentTop === null) currentTop = top;
      } else {
        lines.push(currentLine);
        currentLine = [span];
        currentTop = top;
      }
    });
    if (currentLine.length > 0) {
      lines.push(currentLine);
    }

    element.innerHTML = "";
    lines.forEach((lineWords) => {
      const lineSpan = document.createElement("span");
      lineSpan.className = linesClass;
      lineSpan.style.display = "block";
      lineWords.forEach((wordSpan, idx) => {
        lineSpan.appendChild(wordSpan);
        if (idx < lineWords.length - 1) {
          lineSpan.appendChild(document.createTextNode(" "));
        }
      });
      element.appendChild(lineSpan);
      this.lines.push(lineSpan);
    });

    this.words.push(...wordSpans);
  }

  private splitNodePreserveStructure(root: Element, splitIntoChars: boolean) {
    const processNode = (node: Node): DocumentFragment => {
      const frag = document.createDocumentFragment();

      node.childNodes.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const text = child.textContent || "";
          // Split by whitespace while keeping whitespace tokens
          const tokens = text.split(/(\s+)/);
          tokens.forEach((token) => {
            if (!token) return;
            if (/^\s+$/.test(token)) {
              // Preserve space between words
              frag.appendChild(document.createTextNode(" "));
            } else {
              const wordSpan = document.createElement("span");
              wordSpan.className = "split-word";
              wordSpan.style.display = "inline-block";
              wordSpan.style.whiteSpace = "nowrap";

              if (splitIntoChars) {
                token.split("").forEach((ch) => {
                  const charSpan = document.createElement("span");
                  charSpan.className = "split-char";
                  charSpan.style.display = "inline-block";
                  charSpan.textContent = ch;
                  wordSpan.appendChild(charSpan);
                });
              } else {
                wordSpan.textContent = token;
              }
              frag.appendChild(wordSpan);
            }
          });
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          const el = child as HTMLElement;
          if (el.tagName === "BR") {
            frag.appendChild(document.createElement("br"));
          } else {
            const clone = el.cloneNode(false) as HTMLElement;
            clone.appendChild(processNode(el));
            frag.appendChild(clone);
          }
        }
      });

      return frag;
    };

    const processed = processNode(root);
    root.innerHTML = "";
    root.appendChild(processed);

    this.words.push(...Array.from(root.querySelectorAll(".split-word")));
    if (splitIntoChars) {
      this.chars.push(...Array.from(root.querySelectorAll(".split-char")));
    }
  }

  private wrapVisualLinesForHeading(element: Element, linesClass: string) {
    // Check if element has direct <br> children (e.g. .landing-intro h1)
    const hasBr = element.querySelector("br") !== null;
    if (hasBr) {
      const segments: Node[][] = [[]];
      Array.from(element.childNodes).forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName === "BR") {
          segments.push([]);
        } else {
          segments[segments.length - 1].push(node);
        }
      });

      element.innerHTML = "";
      segments.forEach((seg) => {
        const hasContent = seg.some(
          (n) => (n.textContent || "").trim().length > 0
        );
        if (!hasContent) return;
        const lineWrapper = document.createElement("span");
        lineWrapper.className = linesClass;
        lineWrapper.style.display = "block";
        seg.forEach((n) => lineWrapper.appendChild(n));
        element.appendChild(lineWrapper);
        this.lines.push(lineWrapper);
      });
    } else if (element.querySelector("div") === null) {
      // Single-block heading without nested div/br
      const lineWrapper = document.createElement("span");
      lineWrapper.className = linesClass;
      lineWrapper.style.display = "block";
      while (element.firstChild) {
        lineWrapper.appendChild(element.firstChild);
      }
      element.appendChild(lineWrapper);
      this.lines.push(lineWrapper);
    }
  }

  revert() {
    this.elements.forEach((element) => {
      const original = this.originalHTML.get(element);
      if (original !== undefined) {
        element.innerHTML = original;
      }
    });
    this.chars = [];
    this.words = [];
    this.lines = [];
    this.originalHTML.clear();
  }
}
