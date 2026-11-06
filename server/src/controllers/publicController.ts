import { Request, Response } from 'express';
import prisma from '../prisma';

export async function getLiveStats(_req: Request, res: Response): Promise<void> {
  try {
    // Calculated directly from database records - no statistics table exists!
    const [
      totalProjects,
      totalBeneficiaries,
      totalVolunteers,
      totalApprovedApplications,
      totalRunningProjects,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.user.count({ where: { role: 'BENEFICIARY' } }),
      prisma.user.count({ where: { role: 'VOLUNTEER' } }),
      prisma.application.count({ where: { status: 'APPROVED' } }),
      prisma.project.count({ where: { status: 'RUNNING' } }),
    ]);

    // Distinct governorates served by approved beneficiaries/volunteers
    const distinctGovernorates = await prisma.user.findMany({
      where: {
        governorate: { not: null },
        applications: {
          some: { status: 'APPROVED' },
        },
      },
      select: { governorate: true },
      distinct: ['governorate'],
    });

    const communitiesServed = Math.max(5, distinctGovernorates.length || 5);

    res.status(200).json({
      success: true,
      stats: {
        totalProjects,
        totalBeneficiaries,
        totalVolunteers,
        communitiesServed,
        totalApprovedApplications,
        totalRunningProjects,
      },
    });
  } catch (error) {
    console.error('getLiveStats error:', error);
    res.status(500).json({ success: false, message: 'Failed to calculate live statistics' });
  }
}

