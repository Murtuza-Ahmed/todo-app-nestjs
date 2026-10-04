export const Constants = {
  ROLE: {
    ADMIN_ROLE: 'ADMIN',
    NORMAL_ROLE: 'NORMAL_USER_ROLE',
  },
  // Public POST endpoints (registration, login)
  BY_PASS_URLS: ['/user/create', '/auth/login'],
  // Public GET endpoints (health checks — used by hosting platforms)
  PUBLIC_GET_URLS: ['/'],
};
