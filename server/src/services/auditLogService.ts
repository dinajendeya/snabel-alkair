import prisma from '../prisma';

export interface CreateAuditLogParams {
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  description?: string;
}

export interface AuditLogQueryParams {
  action?: string;
  search?: string;
  limit?: number;
}

export class AuditLogService {
  async log(params: CreateAuditLogParams) {
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

  async getLogs(params: AuditLogQueryParams = {}) {
    const whereClause: any = {};
    if (params.action) {
      whereClause.action = params.action;
    }
    if (params.search) {
      whereClause.OR = [
        { description: { contains: params.search, mode: 'insensitive' } },
        { action: { contains: params.search, mode: 'insensitive' } },
        { entityType: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const logs = await prisma.auditLog.findMany({
      where: whereClause,
      include: {
        actor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: Math.min(params.limit || 100, 200),
    });

    return {
      count: logs.length,
      logs,
    };
  }
}

export const auditLogService = new AuditLogService();

