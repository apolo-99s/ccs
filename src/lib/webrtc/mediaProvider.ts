export type JoinContext = {
  sessionId: string;
  participantId: string;
};

export type MeetingConnection = {
  localStream: MediaStream | null;
  remoteStreams: Map<string, MediaStream>;
  leave: () => Promise<void>;
};

export interface MediaProvider {
  joinSession(context: JoinContext): Promise<MeetingConnection>;
}
