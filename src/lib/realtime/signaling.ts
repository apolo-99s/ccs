export type SignalMessage =
  | {
      type: "peer-joined";
      peerId: string;
    }
  | {
      type: "offer" | "answer";
      peerId: string;
      sdp: RTCSessionDescriptionInit;
    }
  | {
      type: "ice-candidate";
      peerId: string;
      candidate: RTCIceCandidateInit;
    }
  | {
      type: "peer-left";
      peerId: string;
    };

export interface SignalingClient {
  connect(sessionId: string): Promise<void>;
  publish(message: SignalMessage): Promise<void>;
  subscribe(handler: (message: SignalMessage) => void): () => void;
  disconnect(): Promise<void>;
}
