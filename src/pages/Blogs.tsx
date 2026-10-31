import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  BlogPost,
  generateAIBlogPost,
  getBlogPostById,
  getSavedBlogPosts,
  saveGeneratedBlogPost,
} from "../data/blogData";
import { BlogDiagram } from "../components/LatestBlog";
import CallToAction from "../components/CallToAction";
import "./Blogs.css";

const Blogs = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>(() => getSavedBlogPosts());
  const [topicInput, setTopicInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    document.body.style.overflowY = "auto";
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    const raf = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    });
    setPosts(getSavedBlogPosts());
    return () => cancelAnimationFrame(raf);
  }, [id]);

  const activePost = id ? getBlogPostById(id) || posts[0] : null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGenerating) return;
    setIsGenerating(true);
    try {
      const created = await generateAIBlogPost(topicInput);
      saveGeneratedBlogPost(created);
      const updated = getSavedBlogPosts();
      setPosts(updated);
      setTopicInput("");
      navigate(`/blog/${created.id}`);
    } finally {
      setIsGenerating(false);
    }
  };

  if (activePost) {
    const relatedPosts = posts.filter((p) => p.id !== activePost.id).slice(0, 3);

    return (
      <div className="blogs-page">
        <div className="blogs-topbar">
          <Link to="/#blog" className="blogs-back-btn" data-cursor="disable">
            ← Back to Home
          </Link>
          <Link to="/blogs" className="blogs-back-btn" data-cursor="disable">
            All AI Blogs
          </Link>
        </div>

        <article className="blog-article-container">
          <div className="blog-article-meta">
            <span className="blog-article-category">{activePost.category}</span>
            <span className="blog-article-date">{activePost.date}</span>
            <span>•</span>
            <span>{activePost.readTime}</span>
            <span className="blog-article-ai-pill">✨ AI Generated</span>
          </div>

          <h1 className="blog-article-title">{activePost.title}</h1>
          <p className="blog-article-subtitle">{activePost.subtitle}</p>

          <div className="blog-article-hero-visual">
            <div className="blog-visual-header">
              <h4>{activePost.title}</h4>
              <p>{activePost.subtitle}</p>
            </div>
            <BlogDiagram type={activePost.diagramType} />
          </div>

          <div className="blog-article-body">
            <p className="blog-article-intro">{activePost.content.intro}</p>

            {activePost.content.sections.map((sec, idx) => (
              <div key={idx} className="blog-article-section">
                <h2>{sec.heading}</h2>
                <p>{sec.body}</p>
                {sec.code && (
                  <pre className="blog-article-code">
                    <code>{sec.code}</code>
                  </pre>
                )}
              </div>
            ))}

            <div className="blog-article-takeaways">
              <h3>Key Engineering Takeaways</h3>
              <ul>
                {activePost.content.takeaways.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </article>

        {/* More AI Generated Articles */}
        <section className="blogs-related-section">
          <h2>More AI Generated Articles</h2>
          <div className="latest-blog-grid">
            {relatedPosts.map((post) => (
              <article
                key={post.id}
                className="blog-card"
                onClick={() => navigate(`/blog/${post.id}`)}
                data-cursor="disable"
              >
                <div className="blog-card-top">
                  <span className="blog-card-date">{post.date}</span>
                  <h3 className="blog-card-heading">{post.title}</h3>
                  <p className="blog-card-excerpt">{post.excerpt}</p>
                  <Link
                    to={`/blog/${post.id}`}
                    className="blog-read-more"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Read more <span className="blog-arrow">→</span>
                  </Link>
                </div>

                <div className="blog-visual-panel">
                  <div className="blog-visual-header">
                    <h4>{post.title}</h4>
                    <p>{post.subtitle}</p>
                  </div>
                  <div className="blog-visual-artwork">
                    <BlogDiagram type={post.diagramType} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <CallToAction />
      </div>
    );
  }

  return (
    <div className="blogs-page">
      <div className="blogs-topbar">
        <Link to="/" className="blogs-back-btn" data-cursor="disable">
          ← Back to Home
        </Link>
      </div>

      <div className="blogs-header">
        <h1>
          LATEST <span>BLOG</span>
        </h1>
        <p className="blogs-gold-subtitle">Blogs are Ai Generated</p>

        <form className="ai-blog-generator" onSubmit={handleGenerate}>
          <input
            type="text"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            placeholder="Generate a new AI blog on any topic (e.g. Microservices, Next.js 15, Redis)..."
            className="ai-blog-input"
            data-cursor="disable"
          />
          <button
            type="submit"
            className="ai-blog-generate-btn"
            disabled={isGenerating}
            data-cursor="disable"
          >
            {isGenerating ? "✨ Generating..." : "✨ Generate & Read AI Blog"}
          </button>
        </form>
      </div>

      <div className="blogs-grid-wrapper">
        <div className="latest-blog-grid">
          {posts.map((post) => (
            <article
              key={post.id}
              className="blog-card"
              onClick={() => navigate(`/blog/${post.id}`)}
              data-cursor="disable"
            >
              <div className="blog-card-top">
                <span className="blog-card-date">{post.date}</span>
                <h3 className="blog-card-heading">{post.title}</h3>
                <p className="blog-card-excerpt">{post.excerpt}</p>
                <Link
                  to={`/blog/${post.id}`}
                  className="blog-read-more"
                  onClick={(e) => e.stopPropagation()}
                >
                  Read more <span className="blog-arrow">→</span>
                </Link>
              </div>

              <div className="blog-visual-panel">
                <div className="blog-visual-header">
                  <h4>{post.title}</h4>
                  <p>{post.subtitle}</p>
                </div>
                <div className="blog-visual-artwork">
                  <BlogDiagram type={post.diagramType} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <CallToAction />
    </div>
  );
};

export default Blogs;

