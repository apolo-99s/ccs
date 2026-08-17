import { supabase } from "../../lib/supabase/client";

export type SessionStatus =
  | "draft"
  | "scheduled"
  | "live"
  | "ended"
  | "cancelled";

export type Session = {
  id: string;
  room_id: string;
  host_id: string;
  title: string;
  starts_at: string | null;
  ends_at: string | null;
  status: SessionStatus;
  access_policy: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type CreateSessionInput = {
  roomId: string;
  title: string;
  startsAt?: string;
};

export async function listSessions(roomId: string) {
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("room_id", roomId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data as Session[];
}

export async function createSession(input: CreateSessionInput) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be signed in to create a session.");
  }

  const { data, error } = await supabase
    .from("sessions")
    .insert({
      room_id: input.roomId,
      host_id: user.id,
      title: input.title.trim(),
      starts_at: input.startsAt || null,
      status: "draft",
      access_policy: {
        requiresInvitation: true,
        requiresAccessCode: false,
        allowAnonymousDisplayName: false,
        waitingRoomEnabled: true,
        hostApprovalRequired: true,
        allowParticipantChat: true,
        allowParticipantScreenShare: false,
      },
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Session;
}
