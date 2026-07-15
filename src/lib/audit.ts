import prisma from './prisma';

interface CreateAuditLogParams {
  userId?: string | null;
  action: string;
  targetType: string;
  targetId?: string | null;
  description: string;
  ipAddress?: string | null;
}

/**
 * @id SRC-AUDIT-UTIL
 * @implements DOC-BRD
 * @references DOC-RULES
 * @uses SRC-PRISMA-CLIENT
 * @description Audit logging utility.
 * Governed by BRULE-05 (only allow writing/reading, no updates or deletions are exposed).
 */
export async function createAuditLog(params: CreateAuditLogParams) {
  try {
    return await prisma.auditLog.create({
      data: {
        userId: params.userId || null,
        action: params.action,
        targetType: params.targetType,
        targetId: params.targetId || null,
        description: params.description,
        ipAddress: params.ipAddress || null,
      },
    });
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
}
