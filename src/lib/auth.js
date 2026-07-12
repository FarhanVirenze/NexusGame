import { supabaseServer } from '@/lib/supabaseServer';

// Verify JWT token and return user
export async function verifyAuth(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return { error: 'No auth token', status: 401 };

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabaseServer.auth.getUser(token);

  if (error || !user) return { error: 'Invalid token', status: 401 };
  return { user };
}

// Verify JWT + check admin role
export async function verifyAdmin(request) {
  const auth = await verifyAuth(request);
  if (auth.error) return auth;

  const { data, error } = await supabaseServer
    .from('users')
    .select('role')
    .eq('id', auth.user.id)
    .single();

  if (error || !data || data.role !== 'admin') {
    return { error: 'Unauthorized: admin access required', status: 403 };
  }

  return { user: auth.user, role: data.role };
}

// Verify JWT + check user ownership or admin
export async function verifyUserOrAdmin(request, targetUserId) {
  const auth = await verifyAuth(request);
  if (auth.error) return auth;

  // Check if admin
  const { data } = await supabaseServer
    .from('users')
    .select('role')
    .eq('id', auth.user.id)
    .single();

  if (data?.role === 'admin') return { user: auth.user, role: 'admin' };

  // Check ownership
  if (auth.user.id !== targetUserId) {
    return { error: 'Unauthorized: access denied', status: 403 };
  }

  return { user: auth.user, role: data?.role || 'user' };
}

// Allowed tables for CRUD operations
export const ALLOWED_TABLES = ['games', 'users', 'promotions', 'content', 'game_items'];

// Validate table parameter
export function validateTable(table) {
  return ALLOWED_TABLES.includes(table);
}

// Validate file upload
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

export function validateFile(file) {
  if (!file) return { error: 'No file provided' };
  if (file.size > MAX_FILE_SIZE) return { error: 'File too large. Maximum 5MB allowed.' };
  if (!ALLOWED_TYPES.includes(file.type)) return { error: 'Invalid file type. Allowed: JPG, PNG, GIF, WebP, SVG' };
  return { valid: true };
}
