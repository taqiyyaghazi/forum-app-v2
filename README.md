# 💬 Forum App

A modern, robust discussion platform built with bleeding-edge web technologies. This application allows users to register, login, create discussion threads, leave comments, and interact through a comprehensive upvote/downvote system.

It consumes the public Dicoding Forum API.

## ✨ Features

- **Authentication System**: Secure user registration and login using JWT tokens.
- **Interactive Discussions**: Create, browse, and filter threads easily by category.
- **Real-time Feedback**: Optimistic UI updates (`useOptimistic`) on thread and comment votes (likes/dislikes) for instantaneous visual feedback.
- **Comprehensive Leaderboards**: View the most active and highly-rated users in the application.
- **Beautiful UX**: Loading states represented by elegant Skeleton components, fully responsive layouts, and intuitive toast notifications using Sonner.
- **Production Ready**: Fully containerized using Docker with multi-stage builds.

## � Tech Stack

- **Framework**: [React Router 7](https://reactrouter.com/) (Server-Side Rendering enabled).
- **UI Library**: [React 19](https://react.dev/).
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/).
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/).
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) for schema validation.
- **Tooling**: TypeScript, ESLint, Prettier, Vite, pnpm.
- **Deployment**: Docker.

## 🚀 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (v20+) and [pnpm](https://pnpm.io/) installed on your local machine.

### Installation

1. Clone this repository or open the project directory.
2. Install all dependencies:
   ```bash
   pnpm install
   ```
3. Set up environment variables. Create a `.env` file in the root directory:
   ```env
   VITE_API_BASE_URL=https://forum-api.dicoding.dev/v1
   ```

### Development

Run the development server with Hot Module Replacement (HMR):

```bash
pnpm dev
```

The website will be accessible at `http://localhost:5173`.

### Production Build

Create an optimized production build:

```bash
pnpm build
```

After building, start the production server:

```bash
pnpm start
```

The application will be served natively at `http://localhost:3000`.

## 🐳 Docker Deployment

This project includes a multi-stage `Dockerfile` optimized for `pnpm` and smaller image sizes.

1. **Build the Docker Image**:

   ```bash
   docker build -t forum-app .
   ```

2. **Run the Docker Container**:
   ```bash
   docker run -d -p 3000:3000 --name forum-app-container forum-app
   ```
   The app will now be running detached inside the container and accessible at `http://localhost:3000`.

## 📂 Project Structure Highlights

- `app/routes/`: Route components mapping to application URLs (e.g., Home, Thread Detail, Login, Leaderboards).
- `app/components/`: Reusable UI elements, separating business concerns (`thread/`, `auth/`, `comment/`, `leaderboard/`) from basic building blocks (`ui/`).
- `app/stores/`: Redux slices (`authSlice`, `threadsSlice`, `threadDetailSlice`, etc.) managing global state, caching, and dispatching asynchronous API thunks.
- `app/lib/`: Custom utilities, including configured Axios instances (`api.ts`) and global helper functions.

---

_Built with ❤️ using React Router 7._
