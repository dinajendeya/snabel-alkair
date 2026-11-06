import { Request, Response } from 'express';
import { projectService } from '../services/projectService';
import { asyncHandler } from '../utils/asyncHandler';
import { ProjectQueryInput } from '../validators/project.schema';

export const getProjects = asyncHandler(async (req: Request, res: Response) => {
  const result = await projectService.getProjects(req.query as unknown as ProjectQueryInput);
  return res.status(200).json({ success: true, ...result });
});

export const getFeaturedProjects = asyncHandler(async (_req: Request, res: Response) => {
  const result = await projectService.getFeaturedProjects();
  return res.status(200).json({ success: true, ...result });
});

export const getProjectById = asyncHandler(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const result = await projectService.getProjectById(
    id,
    req.user?.id,
    req.user?.role === 'ADMIN'
  );
  return res.status(200).json({ success: true, ...result });
});

export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const result = await projectService.createProject(req.body, req.user?.id);
  return res.status(201).json({
    success: true,
    message: 'Project created successfully and is now active.',
    ...result,
  });
});

export const updateProject = asyncHandler(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const result = await projectService.updateProject(id, req.body, req.user?.id);
  return res.status(200).json({
    success: true,
    message: 'Project updated successfully.',
    ...result,
  });
});

export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const result = await projectService.deleteProject(id, req.user?.id);
  return res.status(200).json({ success: true, ...result });
});

export const updateProjectStatus = asyncHandler(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const result = await projectService.updateProjectStatus(id, req.body, req.user?.id);
  return res.status(200).json({
    success: true,
    message: `Project status set to ${req.body.status}.`,
    ...result,
  });
});

export const getProjectAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const result = await projectService.getProjectAnalytics(id);
  return res.status(200).json({ success: true, ...result });
});
