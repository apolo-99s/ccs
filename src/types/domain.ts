export type RoomStatus = "active" | "archived";

export type SessionStatus =
  | "draft"
  | "scheduled"
  | "live"
  | "ended"
  | "cancelled";

export type ParticipantRole =
  | "host"
  | "co_host"
  | "moderator"
  | "participant";

export type ParticipantStatus =
  | "invited"
  | "waiting"
  | "admitted"
  | "joined"
  | "left"
  | "blocked";

export type AccessPolicy = {
  requiresInvitation: boolean;
  requiresAccessCode: boolean;
  allowAnonymousDisplayName: boolean;
  waitingRoomEnabled: boolean;
  hostApprovalRequired: boolean;
  allowParticipantChat: boolean;
  allowParticipantScreenShare: boolean;
};
