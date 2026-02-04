import { type RouteConfig, index, layout, route } from '@react-router/dev/routes'

export default [
  // Theme
  route('/resources/update-theme', 'routes/resources/update-theme.ts'),

  // Home Route
  route('/', 'routes/index.tsx', { id: 'home' }),
  // Private Routes
  layout('layouts/private.layouts.tsx', [
    // Reindex Jobs
    route('reindex-jobs', 'routes/main/reindex-jobs/layout.tsx', [
      index('routes/main/reindex-jobs/index.tsx'),
      route('new', 'routes/main/reindex-jobs/new.tsx'),
      route(':id', 'routes/main/reindex-jobs/detail/layout.tsx', [
        index('routes/main/reindex-jobs/detail/index.tsx'),
        route('overview', 'routes/main/reindex-jobs/detail/overview.tsx'),
      ]),
    ]),

    // Domain Services
    route('domain-services', 'routes/main/domain-services/layout.tsx', [
      index('routes/main/domain-services/index.tsx'),
      route('new', 'routes/main/domain-services/new.tsx'),
      route(':id/edit', 'routes/main/domain-services/edit.tsx'),
      route(':id', 'routes/main/domain-services/detail/layout.tsx', [
        index('routes/main/domain-services/detail/index.tsx'),
        route('overview', 'routes/main/domain-services/detail/overview.tsx'),
      ]),
    ]),

    // Events
    route('events', 'routes/main/events/layout.tsx', [index('routes/main/events/index.tsx')]),

    // Providers
    route('providers', 'routes/main/providers/layout.tsx', [
      index('routes/main/providers/index.tsx'),
    ]),
  ]),

  // Access Denied
  route('access-denies', 'routes/access-denies.tsx'),

  // Logout Route
  route('logout', 'routes/logout.tsx', { id: 'logout' }),

  // Catch-all route for 404 errors - must be last
  route('*', 'routes/not-found.tsx'),
] as RouteConfig
