import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthProvider";

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  async function handleSignOut() {
    await signOut();
    navigate("/");
  }

  return (
    <main className="app-shell">
      <header>
        <Link to="/" className="brand">
          CCS
        </Link>

        <button type="button" className="ghost" onClick={handleSignOut}>
          Sign out
        </button>
      </header>

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

        <small>Signed in as {user?.email}</small>
      </section>
    </main>
  );
}
