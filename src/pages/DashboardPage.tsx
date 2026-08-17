import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthProvider";
import {
  createRoom,
  listRooms,
  type Room,
} from "../features/rooms/roomService";

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomName, setRoomName] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRooms() {
      try {
        setError("");
        const data = await listRooms();
        setRooms(data);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load rooms.",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadRooms();
  }, []);

  async function handleCreateRoom(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!roomName.trim()) {
      setError("Enter a room name.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const room = await createRoom({
        name: roomName,
        description: roomDescription,
      });

      setRooms((currentRooms) => [room, ...currentRooms]);
      setRoomName("");
      setRoomDescription("");
      setShowForm(false);
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "Unable to create room.",
      );
    } finally {
      setSaving(false);
    }
  }

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
        <div className="dashboard-heading">
          <div>
            <p className="eyebrow">Host workspace</p>

            <h1>Your private rooms</h1>

            <p className="lead">
              Create rooms that will contain your private conferencing
              sessions.
            </p>
          </div>

          <button
            type="button"
            className="button"
            onClick={() => {
              setError("");
              setShowForm((visible) => !visible);
            }}
          >
            {showForm ? "Cancel" : "Create room"}
          </button>
        </div>

        {showForm && (
          <form className="room-form" onSubmit={handleCreateRoom}>
            <h2>Create a private room</h2>

            <label>
              Room name
              <input
                value={roomName}
                onChange={(event) => setRoomName(event.target.value)}
                placeholder="Team training room"
                maxLength={120}
                required
              />
            </label>

            <label>
              Description
              <textarea
                value={roomDescription}
                onChange={(event) => setRoomDescription(event.target.value)}
                placeholder="Optional description"
                maxLength={500}
                rows={4}
              />
            </label>

            <button type="submit" className="button" disabled={saving}>
              {saving ? "Creating…" : "Create room"}
            </button>
          </form>
        )}

        {error && <p className="error page-error">{error}</p>}

        {loading ? (
          <div className="empty-card">
            <p>Loading your rooms…</p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="empty-card">
            <div className="empty-icon">＋</div>

            <h2>No rooms yet</h2>

            <p>Create your first private room to begin organizing sessions.</p>

            {!showForm && (
              <button
                type="button"
                className="button"
                onClick={() => setShowForm(true)}
              >
                Create your first room
              </button>
            )}
          </div>
        ) : (
          <div className="room-grid">
            {rooms.map((room) => (
              <article className="room-card" key={room.id}>
                <span className="status-badge">{room.status}</span>

                <h2>{room.name}</h2>

                <p>{room.description || "No description provided."}</p>

                <small>
                  Created {new Date(room.created_at).toLocaleDateString()}
                </small>

                <Link
                  to={`/sessions?room=${encodeURIComponent(room.id)}`}
                  className="button room-action"
                >
                  Manage sessions
                </Link>
              </article>
            ))}
          </div>
        )}

        <small>Signed in as {user?.email}</small>
      </section>
    </main>
  );
}
