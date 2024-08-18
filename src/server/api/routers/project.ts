import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const projectRouter = createTRPCRouter({
  createProject: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Project name is required"),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.create({
        data: {
          name: input.name,
          description: input.description,
          ownerId: ctx.session.user.id,
        },
      });
      return project;
    }),

  getProjects: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.project.findMany({
      where: { ownerId: ctx.session.user.id },
    });
  }),

  getProjectById: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findUnique({
        where: { id: input.projectId },
      });
      if (!project || project.ownerId !== ctx.session.user.id) {
        throw new Error("Project not found or you do not have access.");
      }
      return project;
    }),

  updateProject: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        name: z.string().min(1, "Project name is required"),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedProject = await ctx.prisma.project.update({
        where: { id: input.projectId },
        data: {
          name: input.name,
          description: input.description,
        },
      });
      return updatedProject;
    }),

  deleteProject: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.project.delete({
        where: { id: input.projectId },
      });
      return { success: true };
    }),
});
