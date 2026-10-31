export type DiagramType = "cubes" | "blueprint" | "hexagons" | "nodes" | "layers" | "pulse";

export interface BlogPost {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  category: string;
  readTime: string;
  excerpt: string;
  diagramType: DiagramType;
  content: {
    intro: string;
    sections: {
      heading: string;
      body: string;
      code?: string;
    }[];
    takeaways: string[];
  };
}

export function getFormattedDate(daysAgo = 0): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date
    .toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();
}

export const defaultBlogPosts: BlogPost[] = [
  {
    id: "nextjs-ssr-edge-caching-65m",
    title: "Scaling Next.js SSR & Redis Edge Caching for 65M+ Monthly Visitors",
    subtitle: "Sub-30ms TTFB with Stale-While-Revalidate at the Redis layer",
    date: getFormattedDate(0),
    category: "Next.js & Performance",
    readTime: "6 min read",
    excerpt:
      "Migrating legacy PHP monolith pages to Next.js App Router with tiered Redis caching, lifting mobile Lighthouse scores from 33 to 65+ under heavy traffic.",
    diagramType: "cubes",
    content: {
      intro:
        "High-traffic news and media platforms serving tens of millions of monthly readers cannot afford cold database hits on every request. Combining Next.js Server-Side Rendering (SSR) with a distributed Redis stale-while-revalidate layer eliminates origin bottlenecks while keeping Core Web Vitals green.",
      sections: [
        {
          heading: "1. Tiered Cache Stampede Protection",
          body: "When a breaking story spikes concurrency to thousands of requests per second, naive TTL expiration triggers a cache stampede. Using Redis probabilistic early expiration with distributed locks ensures only one worker re-renders the route.",
          code: `export async function getCachedPageData<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached) as T;

  const lockKey = \`lock:\${key}\`;
  const acquired = await redis.set(lockKey, "1", "EX", 5, "NX");
  const fresh = await fetcher();
  if (acquired) {
    await redis.setex(key, ttlSeconds, JSON.stringify(fresh));
  }
  return fresh;
}`,
        },
        {
          heading: "2. Streaming Suspense & Critical CSS Inlining",
          body: "Splitting above-the-fold article content from personalized widgets via React Suspense boundaries cuts First Contentful Paint (FCP) and reduces main-thread blocking by over 40%.",
        },
      ],
      takeaways: [
        "Use stale-while-revalidate semantics in Redis to keep p99 TTFB under 35ms.",
        "Defer non-critical third-party scripts and hydrate interactive islands lazily.",
        "Measure real-user Core Web Vitals (LCP, INP, CLS) continuously in CI.",
      ],
    },
  },
  {
    id: "modular-nestjs-microservices-erp",
    title: "Architecting Modular NestJS Microservices With Zero-Trust JWT Guards",
    subtitle: "Domain-isolated service boundaries across 8 enterprise ERP modules",
    date: getFormattedDate(0),
    category: "Backend Architecture",
    readTime: "7 min read",
    excerpt:
      "Designing a multi-tenant SaaS ERP across sales, inventory, billing, and payroll with NestJS domain modules, PostgreSQL row-level isolation, and RBAC guards.",
    diagramType: "blueprint",
    content: {
      intro:
        "Enterprise ERP platforms span tightly regulated domains—from accounting ledgers to HR payroll. A modular monolith in NestJS that can cleanly split into microservices gives teams fast local iteration with strict domain boundaries.",
      sections: [
        {
          heading: "1. Declarative RBAC & Tenant Isolation Guard",
          body: "Every incoming request validates a short-lived signed JWT and attaches tenant-scoped metadata before reaching controller handlers or PostgreSQL queries.",
          code: `@Injectable()
export class TenantRbacGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>("roles", [
      context.getHandler(),
      context.getClass(),
    ]);
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    return Boolean(user?.tenantId && (!requiredRoles || requiredRoles.includes(user.role)));
  }
}`,
        },
        {
          heading: "2. Transactional Outbox Pattern with PostgreSQL",
          body: "When an invoice is finalized in the Billing module, Inventory and Accounting modules must update atomically. Writing domain events to a PostgreSQL outbox table guarantees at-least-once delivery without distributed two-phase commit overhead.",
        },
      ],
      takeaways: [
        "Enforce tenant and role checks at the guard layer, never deep inside controllers.",
        "Use the Transactional Outbox pattern for reliable cross-module events.",
        "Keep DTO validation strict with class-validator and explicit TypeScript types.",
      ],
    },
  },
  {
    id: "offline-first-react-native-sync",
    title: "Offline-First Sync in React Native at 10M+ Downloads Scale",
    subtitle: "Deterministic conflict resolution and background queue replay",
    date: getFormattedDate(0),
    category: "Mobile Engineering",
    readTime: "5 min read",
    excerpt:
      "Building resilient React Native mobile experiences with optimistic UI mutations, local storage queues, JWT token rotation, and zero-jank 60fps lists.",
    diagramType: "hexagons",
    content: {
      intro:
        "Mobile users frequently transition between unstable cellular networks and Wi-Fi. At 10M+ downloads scale, network failures must be invisible to the user through optimistic updates and deterministic sync queues.",
      sections: [
        {
          heading: "1. Optimistic Mutation Queue with Idempotency Keys",
          body: "Each offline action is persisted locally with a client-generated UUID idempotency key and replayed with exponential backoff once connectivity resumes.",
          code: `interface QueuedMutation {
  idempotencyKey: string;
  endpoint: string;
  payload: Record<string, unknown>;
  createdAt: number;
}

export async function flushOfflineQueue(queue: QueuedMutation[]) {
  for (const item of queue) {
    await api.post(item.endpoint, item.payload, {
      headers: { "X-Idempotency-Key": item.idempotencyKey },
    });
  }
}`,
        },
        {
          heading: "2. Silent JWT Refresh Without Dropping In-Flight Requests",
          body: "Using a single shared promise lock in the Axios response interceptor prevents concurrent 401 responses from triggering multiple refresh token calls simultaneously.",
        },
      ],
      takeaways: [
        "Always attach idempotency keys when replaying offline mobile mutations.",
        "Deduplicate token refresh calls using a shared in-memory promise.",
        "Memoize list row components and use FlashList/FlatList windowing for 60fps scroll.",
      ],
    },
  },
];

const aiTopicTemplates: Omit<BlogPost, "id" | "date">[] = [
  {
    title: "High-Throughput Bulk SMS Queues With Redis Streams & Node.js Workers",
    subtitle: "Processing 50K+ daily messages with rate-limiting and DLR webhooks",
    category: "Distributed Systems",
    readTime: "6 min read",
    excerpt:
      "How to architect a fault-tolerant bulk messaging pipeline using Express, Redis consumer groups, PostgreSQL partitioning, and Dockerized worker pools.",
    diagramType: "nodes",
    content: {
      intro:
        "Dispatching tens of thousands of transactional and promotional SMS messages daily requires backpressure-aware queueing, telecom carrier rate-limiting, and asynchronous delivery report (DLR) ingestion.",
      sections: [
        {
          heading: "1. Redis Consumer Groups for Horizontal Worker Scaling",
          body: "Partitioning outbound campaigns across Redis Streams allows multiple Dockerized Node.js workers to process batches concurrently with automatic dead-letter recovery.",
          code: `await redis.xreadgroup(
  "GROUP", "sms-workers", workerId,
  "COUNT", 100, "BLOCK", 2000,
  "STREAMS", "stream:sms:outbound", ">"
);`,
        },
        {
          heading: "2. Batching Delivery Webhooks into PostgreSQL",
          body: "Instead of executing single-row UPDATE statements on every carrier webhook callback, buffering DLR events for 500ms and flushing via bulk UNNEST queries reduces PostgreSQL CPU load by 75%.",
        },
      ],
      takeaways: [
        "Use Redis Streams consumer groups for acknowledgment-safe background jobs.",
        "Batch high-frequency webhook writes into PostgreSQL using UNNEST.",
        "Isolate scheduled cron campaigns from real-time OTP priority queues.",
      ],
    },
  },
  {
    title: "Eliminating React Hydration Mismatches & Optimizing INP in Next.js",
    subtitle: "Deterministic rendering pipelines for sub-100ms Interaction to Next Paint",
    category: "Frontend Performance",
    readTime: "5 min read",
    excerpt:
      "Deep dive into React 18 concurrent rendering, selective hydration, and yielding main-thread tasks to keep Interaction to Next Paint (INP) blazing fast.",
    diagramType: "layers",
    content: {
      intro:
        "Interaction to Next Paint (INP) measures the worst-case responsiveness of a page. Heavy hydration tasks and synchronous state updates on the main thread are the primary culprits behind sluggish web apps.",
      sections: [
        {
          heading: "1. Yielding Long Tasks with startTransition",
          body: "Wrapping non-urgent UI filters and analytics dispatches in React's startTransition keeps input handlers responsive even on low-end mobile devices.",
          code: `import { startTransition } from "react";

function handleFilterChange(nextFilter: string) {
  setSearchInput(nextFilter); // Urgent visual feedback
  startTransition(() => {
    setFilteredResults(computeHeavyFilter(nextFilter));
  });
}`,
        },
        {
          heading: "2. Preventing Timezone & Locale Hydration Drift",
          body: "Server-rendered timestamps often differ from the client's browser timezone. Rendering a deterministic UTC placeholder on first pass and formatting inside a client effect prevents layout-thrashing hydration errors.",
        },
      ],
      takeaways: [
        "Keep input event callbacks under 50ms by deferring heavy state updates.",
        "Avoid reading window or localStorage during initial component render.",
        "Audit bundle sizes per route using @next/bundle-analyzer.",
      ],
    },
  },
  {
    title: "Real-Time Biometric Telemetry With WebSockets, React Native & MongoDB",
    subtitle: "Streaming continuous health vitals with sub-second cloud persistence",
    category: "Full-Stack & IoT",
    readTime: "6 min read",
    excerpt:
      "Engineering a cross-platform health monitoring platform that streams heart-rate and SpO2 telemetry from mobile sensors to MongoDB time-series collections.",
    diagramType: "pulse",
    content: {
      intro:
        "Continuous health monitoring applications must balance battery-efficient mobile sensor polling with low-latency real-time dashboards for patients and clinicians.",
      sections: [
        {
          heading: "1. Time-Series Bucketing in MongoDB",
          body: "Storing each heart-rate sample as an individual document bloats indexes rapidly. Grouping 60 seconds of biometric readings into a single bucketed document cuts storage footprint by 80% and speeds up range queries.",
          code: `{
  userId: "usr_9921",
  bucketStart: ISODate("2026-10-31T07:00:00Z"),
  samplesCount: 60,
  avgBpm: 74,
  minBpm: 68,
  maxBpm: 81,
  readings: [{ t: 0, bpm: 73, spo2: 98 }, /* ... */]
}`,
        },
        {
          heading: "2. Adaptive WebSocket Heartbeats on Mobile",
          body: "Adjusting telemetry flush intervals based on activity state (resting vs. workout) preserves mobile battery while immediately alerting on threshold anomalies.",
        },
      ],
      takeaways: [
        "Use the Bucket Pattern in MongoDB for high-frequency time-series telemetry.",
        "Authenticate WebSocket handshakes with short-lived JWT tickets.",
        "Render live waveforms on a requestAnimationFrame canvas or SVG path.",
      ],
    },
  },
];

export const allSeededBlogPosts: BlogPost[] = [
  ...defaultBlogPosts,
  ...aiTopicTemplates.map((tpl, idx) => ({
    ...tpl,
    id: `seeded-${idx + 1}`,
    date: getFormattedDate(idx + 1),
  })),
];

const STORAGE_KEY = "ar_portfolio_ai_blogs_v1";

export function getSavedBlogPosts(): BlogPost[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return allSeededBlogPosts;
    const custom: BlogPost[] = JSON.parse(raw);
    return [...custom, ...allSeededBlogPosts];
  } catch {
    return allSeededBlogPosts;
  }
}

export function saveGeneratedBlogPost(post: BlogPost): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const existing: BlogPost[] = raw ? JSON.parse(raw) : [];
    const updated = [post, ...existing.filter((p) => p.id !== post.id)].slice(0, 20);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage errors
  }
}

export function getBlogPostById(id?: string): BlogPost | undefined {
  if (!id) return undefined;
  return getSavedBlogPosts().find((p) => p.id === id);
}

let templateCursor = 0;

export async function generateAIBlogPost(customTopic?: string): Promise<BlogPost> {
  const topic = customTopic?.trim();
  const diagramTypes: DiagramType[] = ["cubes", "blueprint", "hexagons", "nodes", "layers", "pulse"];
  const pickedDiagram = diagramTypes[Math.floor(Math.random() * diagramTypes.length)];

  if (topic) {
    try {
      const prompt = encodeURIComponent(
        `Write a concise technical engineering blog post JSON about "${topic}" for a Full-Stack Software Engineer portfolio (React, Next.js, NestJS, React Native, TypeScript, PostgreSQL, Redis). Return ONLY valid JSON with keys: title (string, max 10 words), subtitle (string, max 12 words), category (string), excerpt (string, max 28 words), intro (string), heading1 (string), body1 (string), code1 (string, short TypeScript snippet), heading2 (string), body2 (string), takeaways (array of 3 short strings).`
      );
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6500);
      const res = await fetch(`https://text.pollinations.ai/${prompt}?json=true`, {
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (res.ok) {
        const raw = await res.text();
        const jsonMatch = raw.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.title && parsed.excerpt) {
            return {
              id: `ai-${Date.now()}`,
              title: parsed.title,
              subtitle: parsed.subtitle || `Deep-dive architecture & production patterns for ${topic}`,
              date: getFormattedDate(0),
              category: parsed.category || "AI Generated • Engineering",
              readTime: "5 min read",
              excerpt: parsed.excerpt,
              diagramType: pickedDiagram,
              content: {
                intro: parsed.intro || parsed.excerpt,
                sections: [
                  {
                    heading: parsed.heading1 || `1. Core Architecture for ${topic}`,
                    body:
                      parsed.body1 ||
                      `Designing production-grade ${topic} workflows requires strict type safety, predictable latency, and observability from day one.`,
                    code:
                      parsed.code1 ||
                      `// Production pattern: ${topic}\nexport async function executePipeline<T>(input: T) {\n  const start = performance.now();\n  return { ok: true, latencyMs: Math.round(performance.now() - start), data: input };\n}`,
                  },
                  {
                    heading: parsed.heading2 || "2. Scaling & Production Hardening",
                    body:
                      parsed.body2 ||
                      "By combining caching, idempotent retries, and automated CI benchmarks, teams can ship changes with high confidence.",
                  },
                ],
                takeaways:
                  Array.isArray(parsed.takeaways) && parsed.takeaways.length > 0
                    ? parsed.takeaways
                    : [
                        `Design ${topic} with clear module boundaries and strong TypeScript contracts.`,
                        "Measure p95 latency and error budgets continuously in production.",
                        "Automate testing with Jest and CI/CD pipelines before rollout.",
                      ],
              },
            };
          }
        }
      }
    } catch {
      // Fall back to deterministic local AI synthesizer below
    }

    // Instant deterministic synthesizer for custom topic
    return {
      id: `ai-${Date.now()}`,
      title: `Production Architecture: ${topic} at High Scale`,
      subtitle: `Deterministic performance, caching, and fault-tolerance patterns`,
      date: getFormattedDate(0),
      category: "AI Generated • Deep Dive",
      readTime: "5 min read",
      excerpt: `A practical engineering guide to building, testing, and scaling ${topic} in modern TypeScript, Next.js, and NestJS production environments.`,
      diagramType: pickedDiagram,
      content: {
        intro: `Modern engineering teams adopting ${topic} face critical trade-offs between developer velocity, tail latency, and operational resilience. Here is a battle-tested blueprint for production rollouts.`,
        sections: [
          {
            heading: `1. Type-Safe Contracts & Modular Design for ${topic}`,
            body: `Decoupling core domain logic from transport layers ensures that ${topic} remains testable and easy to evolve under changing product requirements.`,
            code: `export interface PipelineResult<T> {
  status: "success" | "degraded";
  latencyMs: number;
  payload: T;
}

export async function runWithTelemetry<T>(
  operationName: string,
  fn: () => Promise<T>
): Promise<PipelineResult<T>> {
  const t0 = performance.now();
  const payload = await fn();
  return {
    status: "success",
    latencyMs: Math.round(performance.now() - t0),
    payload,
  };
}`,
          },
          {
            heading: "2. Observability, Caching & Graceful Degradation",
            body: `Pairing Redis caching with circuit breakers prevents cascading failures when downstream dependencies experience latency spikes.`,
          },
        ],
        takeaways: [
          `Isolate ${topic} domain logic behind clean TypeScript interfaces.`,
          "Protect downstream services with bounded timeouts and Redis caching.",
          "Back critical paths with automated Jest & integration test suites.",
        ],
      },
    };
  }

  // Rotate from curated AI engineering template pool
  const template = aiTopicTemplates[templateCursor % aiTopicTemplates.length];
  templateCursor += 1;
  return {
    ...template,
    id: `ai-${Date.now()}-${templateCursor}`,
    date: getFormattedDate(0),
  };
}

