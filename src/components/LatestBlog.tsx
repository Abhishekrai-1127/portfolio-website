import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BlogPost,
  DiagramType,
  getSavedBlogPosts,
  generateAIBlogPost,
  saveGeneratedBlogPost,
} from "../data/blogData";
import "./styles/LatestBlog.css";

export const BlogDiagram = ({ type }: { type: DiagramType }) => {
  switch (type) {
    case "cubes":
      return (
        <svg viewBox="0 0 320 190" className="blog-diagram-svg">
          <defs>
            <linearGradient id="cubeTop" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#8ecae6" stop-opacity="0.85" />
              <stop offset="100%" stop-color="#4895ef" stop-opacity="0.55" />
            </linearGradient>
            <linearGradient id="cubeLeft" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#4ea8de" stop-opacity="0.7" />
              <stop offset="100%" stop-color="#2b4c65" stop-opacity="0.7" />
            </linearGradient>
            <linearGradient id="cubeRight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#3a5a78" stop-opacity="0.8" />
              <stop offset="100%" stop-color="#1d2f42" stop-opacity="0.8" />
            </linearGradient>
          </defs>
          <polygon
            points="95,45 115,34 135,45 135,68 115,79 95,68"
            fill="#ffffff"
            fillOpacity="0.08"
          />
          <polygon
            points="185,45 205,34 225,45 225,68 205,79 185,68"
            fill="#ffffff"
            fillOpacity="0.08"
          />
          <polygon
            points="140,128 160,117 180,128 180,151 160,162 140,151"
            fill="#ffffff"
            fillOpacity="0.08"
          />
          <g transform="translate(160, 52)">
            <polygon points="0,-28 28,-14 0,0 -28,-14" fill="url(#cubeTop)" />
            <polygon points="-28,-14 0,0 0,30 -28,16" fill="url(#cubeLeft)" />
            <polygon points="28,-14 0,0 0,30 28,16" fill="url(#cubeRight)" />
          </g>
          <g transform="translate(115, 112)">
            <polygon points="0,-28 28,-14 0,0 -28,-14" fill="url(#cubeTop)" />
            <polygon points="-28,-14 0,0 0,30 -28,16" fill="url(#cubeLeft)" />
            <polygon points="28,-14 0,0 0,30 28,16" fill="url(#cubeRight)" />
          </g>
          <g transform="translate(205, 112)">
            <polygon points="0,-28 28,-14 0,0 -28,-14" fill="url(#cubeTop)" />
            <polygon points="-28,-14 0,0 0,30 -28,16" fill="url(#cubeLeft)" />
            <polygon points="28,-14 0,0 0,30 28,16" fill="url(#cubeRight)" />
          </g>
          <polygon
            points="160,48 115,108 205,108"
            fill="none"
            stroke="#56cfe1"
            strokeWidth="2.2"
          />
          <circle cx="160" cy="48" r="3.5" fill="#72efdd" />
          <circle cx="115" cy="108" r="3.5" fill="#72efdd" />
          <circle cx="205" cy="108" r="3.5" fill="#72efdd" />
        </svg>
      );

    case "blueprint":
      return (
        <svg viewBox="0 0 320 190" className="blog-diagram-svg">
          <defs>
            <pattern id="bpGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="0.5"
                strokeOpacity="0.22"
              />
            </pattern>
          </defs>
          <rect width="320" height="190" fill="url(#bpGrid)" />
          <g stroke="#60a5fa" strokeWidth="1.4" fill="#1e3a8a" fillOpacity="0.28">
            <rect x="42" y="38" width="85" height="48" rx="6" />
            <rect x="192" y="38" width="85" height="48" rx="6" />
            <rect x="118" y="108" width="85" height="52" rx="6" stroke="#38bdf8" strokeWidth="2" />
          </g>
          <polygon
            points="160,118 182,134 160,150 138,134"
            fill="#38bdf8"
            fillOpacity="0.35"
            stroke="#7dd3fc"
            strokeWidth="1.5"
          />
          <path
            d="M127,62 L160,62 L160,108 M192,62 L160,62"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.6"
            strokeDasharray="4 3"
          />
          <text x="84" y="66" textAnchor="middle" fill="#93c5fd" fontSize="10" fontFamily="monospace">
            AUTH / JWT
          </text>
          <text x="234" y="66" textAnchor="middle" fill="#93c5fd" fontSize="10" fontFamily="monospace">
            REDIS CACHE
          </text>
          <text x="160" y="174" textAnchor="middle" fill="#7dd3fc" fontSize="9.5" fontFamily="monospace">
            NESTJS CORE MESH
          </text>
        </svg>
      );

    case "hexagons":
      return (
        <svg viewBox="0 0 320 190" className="blog-diagram-svg">
          <defs>
            <linearGradient id="hexLeft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#3f3f46" stop-opacity="0.55" />
              <stop offset="100%" stop-color="#18181b" stop-opacity="0.85" />
            </linearGradient>
            <linearGradient id="hexRight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#d4d4d8" stop-opacity="0.45" />
              <stop offset="100%" stop-color="#52525b" stop-opacity="0.35" />
            </linearGradient>
          </defs>
          <polygon
            points="75,32 145,32 175,95 145,158 75,158 45,95"
            fill="url(#hexLeft)"
            stroke="#a1a1aa"
            strokeOpacity="0.25"
            strokeWidth="1.2"
          />
          <polygon
            points="175,32 245,32 275,95 245,158 175,158 145,95"
            fill="url(#hexRight)"
            stroke="#e4e4e7"
            strokeOpacity="0.35"
            strokeWidth="1.2"
          />
          <polygon
            points="160,63 175,95 160,127 145,95"
            fill="#f59e0b"
            fillOpacity="0.28"
            stroke="#fbbf24"
            strokeWidth="2"
          />
        </svg>
      );

    case "nodes":
      return (
        <svg viewBox="0 0 320 190" className="blog-diagram-svg">
          <g stroke="#c2a4ff" strokeOpacity="0.45" strokeWidth="1.6">
            <line x1="70" y1="95" x2="155" y2="50" />
            <line x1="70" y1="95" x2="155" y2="95" />
            <line x1="70" y1="95" x2="155" y2="140" />
            <line x1="155" y1="50" x2="250" y2="95" />
            <line x1="155" y1="95" x2="250" y2="95" />
            <line x1="155" y1="140" x2="250" y2="95" />
          </g>
          <circle cx="70" cy="95" r="18" fill="#1e1b4b" stroke="#c2a4ff" strokeWidth="2" />
          <circle cx="155" cy="50" r="14" fill="#1e1b4b" stroke="#38bdf8" strokeWidth="2" />
          <circle cx="155" cy="95" r="14" fill="#1e1b4b" stroke="#38bdf8" strokeWidth="2" />
          <circle cx="155" cy="140" r="14" fill="#1e1b4b" stroke="#38bdf8" strokeWidth="2" />
          <circle cx="250" cy="95" r="20" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
        </svg>
      );

    case "layers":
      return (
        <svg viewBox="0 0 320 190" className="blog-diagram-svg">
          <polygon
            points="160,115 245,142 160,169 75,142"
            fill="#312e81"
            fillOpacity="0.55"
            stroke="#818cf8"
            strokeWidth="1.5"
          />
          <polygon
            points="160,82 245,109 160,136 75,109"
            fill="#4c1d95"
            fillOpacity="0.6"
            stroke="#a78bfa"
            strokeWidth="1.5"
          />
          <polygon
            points="160,49 245,76 160,103 75,76"
            fill="#0f766e"
            fillOpacity="0.65"
            stroke="#2dd4bf"
            strokeWidth="1.8"
          />
        </svg>
      );

    case "pulse":
    default:
      return (
        <svg viewBox="0 0 320 190" className="blog-diagram-svg">
          <path
            d="M 25 100 L 85 100 L 105 62 L 125 138 L 148 42 L 172 132 L 192 82 L 212 100 L 295 100"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="148" cy="42" r="5" fill="#f43f5e" />
          <circle cx="172" cy="132" r="4" fill="#38bdf8" />
        </svg>
      );
  }
};

const LatestBlog = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>(() => getSavedBlogPosts().slice(0, 3));
  const [topicInput, setTopicInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateBlog = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isGenerating) return;

    setIsGenerating(true);
    try {
      const newPost = await generateAIBlogPost(topicInput);
      saveGeneratedBlogPost(newPost);
      setPosts((prev) => [newPost, ...prev.slice(0, 2)]);
      setTopicInput("");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="latest-blog-section section-container" id="blog">
      <div className="latest-blog-header">
        <h2 className="latest-blog-title">LATEST BLOG</h2>
        <p className="latest-blog-subtitle">Blogs are Ai Generated</p>

        {/* Interactive AI Blog Generator Bar */}
        <form className="ai-blog-generator" onSubmit={handleGenerateBlog}>
          <input
            type="text"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            placeholder="Enter a tech topic (e.g. Redis Streams, Next.js SSR, NestJS) or leave blank..."
            className="ai-blog-input"
            data-cursor="disable"
          />
          <button
            type="submit"
            className="ai-blog-generate-btn"
            disabled={isGenerating}
            data-cursor="disable"
          >
            {isGenerating ? "✨ Generating with AI..." : "✨ Generate New AI Blog"}
          </button>
        </form>
      </div>

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
                data-cursor="disable"
              >
                Read more <span className="blog-arrow">→</span>
              </Link>
            </div>

            {/* Bottom Dark Architectural Diagram Panel matching screenshot */}
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

      <div className="latest-blog-footer">
        <Link to="/blogs" className="view-all-blogs-btn" data-cursor="disable">
          Explore All AI Blogs →
        </Link>
      </div>
    </section>
  );
};

export default LatestBlog;
