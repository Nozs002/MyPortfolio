/**
 * @id SRC-AUTH-SHIELD
 * @implements DOC-PRD
 * @references DOC-RULES
 * @description Helper function to verify admin session inside administrative Server Actions (defense-in-depth).
 */
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../app/api/auth/[...nextauth]/route';

/**
 * Verifies that the current request has a valid administrator session.
 * Throws an Error if unauthorized, which blocks Server Action execution.
 */
export async function verifyAdminSession() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error('Unauthorized: Access denied.');
  }

  return session;
}
