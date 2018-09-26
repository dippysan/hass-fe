const routes = [{
  path: '/',
  component: () =>
    import('layouts/MyLayout.vue'),
  children: [
    { path: '', component: () => import('pages/Index.vue') },
    { path: 'config', component: () => import('pages/config.vue') },
    { path: 'login', component: () => import('pages/login.vue') },
    { path: 'weather', component: () => import('pages/weather.vue') },
    { path: 'entities', component: () => import('pages/entities.vue') }

  ]
}]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () =>
      import('pages/Error404.vue')
  })
}

export default routes
