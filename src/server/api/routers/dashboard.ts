import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { Task } from "@prisma/client";

export const dashboardRouter = createTRPCRouter({
  getDashboardStats: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const projects = await ctx.prisma.project.findMany({
      where: { ownerId: userId },
    });

    const tasks = await ctx.prisma.task.findMany({
      where: {
        projectId: { in: projects.map((p) => p.id) },
      },
    });

    const totalProjects = projects.length;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === "Completed").length;
    const inProgressTasks = tasks.filter((t) => t.status === "InProgress").length;

    type TaskPriorityCounts = {
      [key: string]: number;
    };

    const tasksByPriority: TaskPriorityCounts = tasks.reduce((acc, task) => {
      const priorityKey = task.priority || "No Priority";
      acc[priorityKey] = (acc[priorityKey] || 0) + 1;
      return acc;
    }, {} as TaskPriorityCounts);

    return {
      totalProjects,
      totalTasks,
      completedTasks,
      tasksByPriority,
      inProgressTasks 
    };
  }),
});
