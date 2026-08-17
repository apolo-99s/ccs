# CCS — Private Conferencing Platform

CCS is a standalone private video-conferencing platform for:

- Closed conferences
- Private training sessions
- Meetings
- Online classes

This project is completely independent from the Digital Skills Academy.

## Current foundation

The first foundation includes:

- React and TypeScript
- Vite
- Supabase client setup
- Supabase authentication integration
- Public landing page
- Login and registration pages
- Protected host dashboard
- Initial database schema
- Row Level Security foundation
- Domain types
- WebRTC media-provider interface
- Realtime signaling interface
- Responsive layout

## Intentionally deferred

These features will be added in later milestones:

- Live video implementation
- Camera and microphone controls
- Screen sharing
- Private chat interface
- Room creation
- Session management
- Invitations and access codes
- Participant moderation
- Recording
- SFU media architecture
- Advanced end-to-end encryption

## Local environment

Create a local environment file named `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
