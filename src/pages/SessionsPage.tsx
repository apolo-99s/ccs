import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  createRoom,
  listRooms,
  type Room,
} from "../features/rooms/roomService";
import {
  createSession,
  listSessions,
  type Session,
} from "../features/sessions/sessionService";

export function SessionsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const selectedRoomId = searchParams.get("room");

  const [rooms, setRooms] = useState<Room[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [roomId, setRoomId] = useState(selectedRoomId ?? "");
  const [title, setTitle] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRooms() {
      try {
        const roomData = await listRooms();
        setRooms(roomData);

        if (!roomId && roomData.length > 0) {
          setRoomId(roomData[0].id);
        }
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
  }, [roomId]);

  useEffect(() => {
    if (!roomId) {
      setSessions([]);
      return;
    }

    async function loadSessions() {
      try {
        const data = await listSessions(roomId);
        setSessions(data);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load sessions.",
        );
      }
    }

    void loadSessions();
  }, [roomId]);

  async function handleCreateSession(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!roomId) {
      setError("Create or select a room first.");
      return;
    }

    if (!title.trim()) {
      setError("Enter a session title.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const session = await createSession({
        roomId,
        title,
        startsAt: startsAt || undefined,
      });

      setSessions((currentSessions) => [session, ...currentSessions]);
      setTitle("");
      setStartsAt("");
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "Unable to create session.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <main className="center">Loading rooms…</main>;
  }

  return (
    <main className="app-shell">
      <header>
        <Link to="/dashboard" className="brand">
          CCS
        </Link>

        <Link to="/dashboard" className="text-link">
          Back to rooms
        </Link>
      </header>

      <section className="dashboard">
        <p className="eyebrow">Session management</p>
        <h1>Private sessions</h1>
        <p className="lead">
          Create scheduled or draft sessions inside your private rooms.
        </p>

        {rooms.length === 0 ? (
          <div className="empty-card">
            <h2>Create a room first</h2>
            <p>A session must belong to a private room.</p>
            <Link to="/dashboard" className="button">
              Go to rooms
            </Link>
          </div>
        ) : (
          <>
            <label className="room-selector">
              Room
              <select
                value={roomId}
                onChange={(event) => {
                  setRoomId(event.target.value);
                  navigate(`/sessions?room=${event.target.value}`);
                }}
              >
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
              </select>
            </label>

            <form className="room-form" onSubmit={handleCreateSession}>
              <h2>Create a private session</h2>

              <label>
                Session title
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Weekly private training"
                  maxLength={160}
                  required
                />
              </label>

              <label>
                Start time
                <input
                  type="datetime-local"
                  value={startsAt}
                  onChange={(event) => setStartsAt(event.target.value)}
                />
              </label>

              {error && <p className="error page-error">{error}</p>}

              <button type="submit" className="button" disabled={saving}>
                {saving ? "Creating…" : "Create session"}
              </button>
            </form>

            {sessions.length === 0 ? (
              <div className="empty-card">
                <h2>No sessions in this room</h2>
                <p>Create the first session using the form above.</p>
              </div>
            ) : (
              <div className="room-grid">
                {sessions.map((session) => (
                  <article className="room-card" key={session.id}>
                    <span className="status-badge">{session.status}</span>
                    <h2>{session.title}</h2>
                    <p>
                      {session.starts_at
                        ? new Date(session.starts_at).toLocaleString()
                        : "Not scheduled"}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
