import { z } from "zod";

export const taskSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),
    status: z.enum(["Todo", "In Progress", "Completed"]).optional(),
    priority: z.enum(["Low", "Medium", "High"]).optional(),
    dueDate: z.string().datetime().optional().or(z.string().length(0)),
  }),
});

export const updateTaskSchema=z.object({
  body:taskSchema.shape.body.partial()
})
