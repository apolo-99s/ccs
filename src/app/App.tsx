import { BrowserRouter, Link, Route, Routes } from "react-router-dom";

function LandingPage() {
  return (
    <main>
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
          A focused foundation for closed conferences, private training,
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

function LoginPage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link to="/" className="brand">
          CCS
        </Link>

        <h1>Welcome back</h1>
        <p>Sign in to manage your private sessions.</p>

        <form>
          <label>
            Email
            <input type="email" placeholder="you@example.com" />
          </label>

          <label>
            Password
            <input type="password" placeholder="Your password" />
          </label>

          <button type="button" className="button">
            Sign in
          </button>
        </form>

        <p>
          New to CCS? <Link to="/register">Create an account</Link>
        </p>
      </section>
    </main>
  );
}

function RegisterPage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link to="/" className="brand">
          CCS
        </Link>

        <h1>Create your account</h1>
        <p>Start with a secure foundation for private sessions.</p>

        <form>
          <label>
            Email
            <input type="email" placeholder="you@example.com" />
          </label>

          <label>
            Password
            <input type="password" placeholder="At least 8 characters" />
          </label>

          <button type="button" className="button">
            Create account
          </button>
        </form>

        <p>
          Already registered? <Link to="/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
}

function DashboardPage() {
  return (
    <main>
      <nav>
        <Link to="/" className="brand">
          CCS
        </Link>

        <Link to="/" className="text-link">
          Sign out
        </Link>
      </nav>

      <section className="dashboard">
        <p className="eyebrow">Host workspace</p>

        <h1>Your private sessions</h1>

        <p className="lead">
          The foundation is ready. Room and session management will be added as
          separate modules.
        </p>

        <div className="empty-card">
          <div className="empty-icon">＋</div>
          <h2>No sessions yet</h2>
          <p>
            Create your first private session when the room-management module
            is enabled.
          </p>

          <button type="button" className="button" disabled>
            Create session
          </button>
        </div>
      </section>
    </main>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  );
}
