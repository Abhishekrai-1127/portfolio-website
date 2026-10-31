import { Link } from "react-router-dom";
import { config } from "../config";
import "./styles/CallToAction.css";

const CallToAction = () => {
  return (
    <div className="cta-section">
      <div className="cta-card">
        <span className="cta-badge">AVAILABLE FOR OPPORTUNITIES</span>
        <h2>
          Let's Build Something <span>Impactful</span> Together
        </h2>
        <p>
          Looking for a Full-Stack Software Engineer experienced in high-traffic Next.js,
          React Native, and NestJS architectures? Let's connect.
        </p>
        <div className="cta-buttons">
          <a
            href={config.contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-btn cta-btn-hire"
            data-cursor="disable"
          >
            Hire Me on LinkedIn →
          </a>

          <a
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${config.contact.email}`}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-btn cta-btn-play"
            data-cursor="disable"
          >
            Send an Email ✉
          </a>

          <a
            href={config.contact.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="cta-btn cta-btn-play"
            data-cursor="disable"
          >
            Download CV ↓
          </a>

          <Link to="/play" className="cta-btn cta-btn-play" data-cursor="disable">
            Play Chess With Me ♟
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CallToAction;
