import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('register', 'routes/register.tsx'),
  route('login', 'routes/login.tsx'),
  route('new', 'routes/new-thread.tsx'),
  route('threads/:id', 'routes/thread-detail.tsx'),
  route('leaderboards', 'routes/leaderboards.tsx'),
] satisfies RouteConfig;
