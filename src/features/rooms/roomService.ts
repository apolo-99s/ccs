import { supabase } from "../../lib/supabase/client";

export type Room = {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  status: "active" | "archived";
  default_policy: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type CreateRoomInput = {
  name: string;
  description?: string;
};

export async function listRooms() {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data as Room[];
}

export async function createRoom(input: CreateRoomInput) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("You must be signed in to create a room.");
  }

  const { data, error } = await supabase
    .from("rooms")
    .insert({
      owner_id: user.id,
      name: input.name.trim(),
      description: input.description?.trim() || null,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Room;
}

export async function archiveRoom(roomId: string) {
  const { data, error } = await supabase
    .from("rooms")
    .update({ status: "archived" })
    .eq("id", roomId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Room;
}
