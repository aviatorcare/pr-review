import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const patients = [
  {
    id: "patient-101",
    displayName: "Jordan Lee",
    dateOfBirth: "1954-08-16",
    candidateConditions: [
      ["condition-101", "E11.9", "Type 2 diabetes mellitus", "A1c and metformin documented in the latest visit."],
      ["condition-102", "I50.9", "Heart failure", "Historical problem-list entry without recent supporting assessment."],
    ],
  },
  {
    id: "patient-102",
    displayName: "Riley Morgan",
    dateOfBirth: "1948-02-03",
    candidateConditions: [
      ["condition-103", "J44.9", "Chronic obstructive pulmonary disease", "Pulmonology note documents active inhaler management."],
      ["condition-104", "N18.3", "Chronic kidney disease, stage 3", "Two recent eGFR values are below 55."],
    ],
  },
  {
    id: "patient-103",
    displayName: "Casey Taylor",
    dateOfBirth: "1961-11-27",
    candidateConditions: [
      ["condition-105", "F33.1", "Major depressive disorder", "Behavioral health plan references ongoing treatment."],
      ["condition-106", "E66.01", "Morbid obesity", "Problem-list entry has no current BMI or assessment."],
    ],
  },
] as const;

async function seed() {
  await prisma.conditionReview.deleteMany();
  await prisma.candidateCondition.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.reviewer.deleteMany();

  await prisma.reviewer.createMany({
    data: [
      { id: "reviewer-1", displayName: "Dr. Maya Chen" },
      { id: "reviewer-2", displayName: "Alex Rivera, RN" },
    ],
  });

  for (const patient of patients) {
    await prisma.patient.create({
      data: {
        id: patient.id,
        displayName: patient.displayName,
        dateOfBirth: patient.dateOfBirth,
        candidateConditions: {
          create: patient.candidateConditions.map(([id, code, description, evidenceSummary]) => ({
            id,
            code,
            description,
            evidenceSummary,
          })),
        },
      },
    });
  }

  await prisma.conditionReview.create({
    data: {
      candidateConditionId: "condition-102",
      reviewerId: "reviewer-2",
      isRelevant: false,
      needsMoreInformation: false,
    },
  });
  await prisma.candidateCondition.update({
    where: { id: "condition-102" },
    data: { isRelevant: false, reviewedById: "reviewer-2" },
  });
}

seed()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
