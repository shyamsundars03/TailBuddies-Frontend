/** API base URL (includes `/api`). Used by axios client. */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/** Socket server origin (no `/api` suffix). */
export const SOCKET_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');
