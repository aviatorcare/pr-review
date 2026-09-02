import { Router } from "express";
import { authenticatedUser } from "./auth";
import { prisma } from "./db";

interface ReviewInput {
  isRelevant?: boolean;
  needsMoreInformation?: boolean;
  reviewerId: string;
  note?: string;
}

export const conditionReviewsRouter = Router();

conditionReviewsRouter.get("/", async (_request, response) => {
  const candidates = await prisma.candidateCondition.findMany({
    orderBy: { updatedAt: "asc" },
  });

  const queue = await Promise.all(
    candidates.map(async (candidate) => {
      const patient = await prisma.patient.findUniqueOrThrow({
        where: { id: candidate.patientId },
      });
      const latestReview = await prisma.conditionReview.findFirst({
        where: { candidateConditionId: candidate.id },
        orderBy: { createdAt: "desc" },
        include: { reviewer: true },
      });

      return {
        id: candidate.id,
        patient: {
          name: patient.displayName,
          dateOfBirth: patient.dateOfBirth,
        },
        code: candidate.code,
        description: candidate.description,
        evidenceSummary: candidate.evidenceSummary,
        isRelevant: candidate.isRelevant,
        needsMoreInformation: candidate.needsMoreInformation,
        lastReviewedBy: latestReview?.reviewer.displayName ?? null,
      };
    }),
  );

  response.json(queue);
});

conditionReviewsRouter.patch(
  "/:candidateId",
  async (request, response) => {
    const currentUser = authenticatedUser(request);
    const input = request.body as ReviewInput;

    const review = await prisma.conditionReview.create({
      data: {
        candidateConditionId: request.params.candidateId,
        reviewerId: input.reviewerId,
        isRelevant: input.isRelevant ?? null,
        needsMoreInformation: input.needsMoreInformation ?? false,
        note: input.note,
      },
    });

    const candidate = await prisma.candidateCondition.update({
      where: { id: request.params.candidateId },
      data: {
        isRelevant: input.isRelevant ?? null,
        needsMoreInformation: input.needsMoreInformation ?? false,
        reviewedById: currentUser.id,
      },
    });

    response.json({ candidate, review });
  },
);
