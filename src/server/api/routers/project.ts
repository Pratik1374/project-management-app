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
        include: {
          members: {
            include: {
              user: true, 
            },
          },
        },
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

  addMember: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        userId: z.string(),
        role: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existingMember = await ctx.prisma.projectMember.findUnique({
        where: {
          projectId_userId: {
            projectId: input.projectId,
            userId: input.userId,
          },
        },
      });

      if (existingMember) {
        throw new Error("User is already a member of this project.");
      }

      const newMember = await ctx.prisma.projectMember.create({
        data: {
          projectId: input.projectId,
          userId: input.userId,
          role: input.role || "Member",
        },
      });

      return newMember;
    }),

    getProjectMembers: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const members = await ctx.prisma.projectMember.findMany({
        where: { projectId: input.projectId },
        include: { user: true },
      });

      return members.map((member) => ({
        id: member.userId,
        email: member.user.email,
        role: member.role,
        name: member.user.name || "Unknown User",
      }));
    }),
});
