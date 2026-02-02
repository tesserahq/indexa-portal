import { type RouteConfig, index, layout, route } from '@react-router/dev/routes'

export default [
  // Theme
  route('/resources/update-theme', 'routes/resources/update-theme.ts'),

  // Home Route
  route('/', 'routes/index.tsx', { id: 'home' }),
  // Private Routes
  layout('layouts/private.layouts.tsx', [
    route('reindex-jobs', 'routes/main/reindex-jobs/layout.tsx', [
      index('routes/main/reindex-jobs/index.tsx'),
    ]),
  ]),

  // Access Denied
  route('access-denies', 'routes/access-denies.tsx'),

  // Logout Route
  route('logout', 'routes/logout.tsx', { id: 'logout' }),

  // Catch-all route for 404 errors - must be last
  route('*', 'routes/not-found.tsx'),
] as RouteConfig
