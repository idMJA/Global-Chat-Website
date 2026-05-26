# Global Chat Website

A premium, responsive, and real-time web dashboard and landing page for the Global Chat network. Built with modern web technologies, this platform provides real-time system monitoring, server statistics, and seamless integrations with the Global Chat API.

## Features

- **Real-Time System Monitoring**: Tracks the health of the Global Chat API and displays the network's active status.
- **Live Statistics**: Displays real-time metrics, such as the total number of connected servers and total messages, fetched dynamically from the network.
- **Bot Member Presence**: Shows a real-time list of connected bot members along with their avatars and online/idle/offline status.
- **API Proxy Routing**: Protects backend services by routing requests through Next.js server-side API routes, keeping internal URLs and endpoints strictly private.
- **Modern & Aesthetic UI**: Features a beautiful dark-themed, responsive design with dynamic micro-animations and Tailwind CSS styling.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Library**: React
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Tooling**: Biome (Linter/Formatter), Bun

## Getting Started

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or later)
- [Bun](https://bun.sh/) (Recommended package manager)

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   git clone <repository-url>
   cd "Global Chat Website"
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory and add the required backend API URLs. Do not expose these URLs directly in the frontend.
   ```env
   GLOBAL_CHAT_API_URL="http://your-global-chat-api-url"
   PRESENCE_API_URL="http://your-presence-api-url"
   ```

### Running the Development Server

Start the local development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. The page will auto-update as you edit the source files.

## Architecture

- **`src/app/`**: Contains the Next.js App Router pages (e.g., Landing Page, Learn More).
- **`src/app/api/`**: Server-side API proxy routes (`/api/stats`, `/api/health`, `/api/members`) that safely fetch data from the backend without exposing external URLs.
- **`src/components/`**: Reusable React UI components (e.g., `SystemStatus` dashboard).
- **`src/lib/`**: Utility functions and shared TypeScript types for strict type safety.

## License

This project is licensed under the [GNU Affero General Public License v3.0 (AGPL-3.0)](LICENSE) - see the [LICENSE](LICENSE) file for details.
