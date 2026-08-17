import { Link } from "react-router-dom";

export function LandingPage() {
  return (
    <main className="shell">
      <nav>
        <Link to="/" className="brand">
          CCS
        </Link>

        <div className="nav-actions">
          <Link to="/login">Log in</Link>

          <Link to="/register" className="button button-small">
            Create account
          </Link>
        </div>
      </nav>

      <section className="hero">
        <p className="eyebrow">Private conferencing infrastructure</p>

        <h1>
          Meet privately.
          <br />
          <em>Connect confidently.</em>
        </h1>

        <p className="lead">
          A focused platform for closed conferences, private training,
          meetings, and online classes.
        </p>

        <div className="hero-actions">
          <Link to="/register" className="button">
            Get started
          </Link>

          <Link to="/login" className="text-link">
            I already have an account →
          </Link>
        </div>
      </section>
    </main>
  );
}
