import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const taskRouter = createTRPCRouter({
  createTask: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        title: z.string().min(1, "Task title is required"),
        description: z.string().optional(),
        dueDate: z.date().optional(),
        assignedToId: z.string().nullable().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.prisma.task.create({
        data: {
          ...input,
          projectId: input.projectId,
        },
      });
      return task;
    }),

  getTasksByProject: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const tasks = await ctx.prisma.task.findMany({
        where: { projectId: input.projectId },
        orderBy: { dueDate: "asc" },
      });
      return tasks;
    }),

  getTaskById: protectedProcedure
    .input(z.object({ taskId: z.string() }))
    .query(async ({ ctx, input }) => {
      const task = await ctx.prisma.task.findUnique({
        where: { id: input.taskId },
      });
      if (!task) {
        throw new Error("Task not found.");
      }
      return task;
    }),

  updateTask: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        title: z.string().min(1, "Task title is required"),
        description: z.string().optional(),
        dueDate: z.date().optional(),
        assignedToId: z.string().nullable().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedTask = await ctx.prisma.task.update({
        where: { id: input.taskId },
        data: input,
      });
      return updatedTask;
    }),

  deleteTask: protectedProcedure
    .input(z.object({ taskId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.task.delete({
        where: { id: input.taskId },
      });
      return { success: true };
    }),

  updateTaskStatus: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        status: z.enum(["ToDo", "InProgress", "Completed"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedTask = await ctx.prisma.task.update({
        where: { id: input.taskId },
        data: { status: input.status },
      });
      return updatedTask;
    }),

  assignTask: protectedProcedure
    .input(
      z.object({
        taskId: z.string(),
        assignedToId: z.string().nullable().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedTask = await ctx.prisma.task.update({
        where: { id: input.taskId },
        data: { assignedToId: input.assignedToId },
      });
      return updatedTask;
    }),

  getMyTasks: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const tasks = await ctx.prisma.task.findMany({
      where: {
        assignedToId: userId,
      },
      include: {
        project: {
          include: {
            owner: true,
          },
        },
      },
      orderBy: [{ project: { name: "asc" } }, { dueDate: "asc" }],
    });

    const sortedTasks = [...tasks].sort((a, b) => {
      if (a.project.ownerId === userId && b.project.ownerId !== userId) {
        return -1;
      } else if (a.project.ownerId !== userId && b.project.ownerId === userId) {
        return 1;
      } else {
        return 0;
      }
    });

    return sortedTasks;
  }),
});
