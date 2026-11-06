import prisma from '../prisma';

export interface CreateAuditLogParams {
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  description?: string;
}

export async function createAuditLog(params: CreateAuditLogParams) {
  try {
    return await prisma.auditLog.create({
      data: {
        actorId: params.actorId,
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        description: params.description || '',
      },
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
    return null;
  }
}
