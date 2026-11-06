import { z } from 'zod';

export const notificationIdParamSchema = z.object({
  id: z.string().min(1, 'Notification ID is required'),
});

export type NotificationIdParamInput = z.infer<typeof notificationIdParamSchema>;

