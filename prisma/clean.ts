import { prisma } from "../src/config/prisma";

async function clean() {
  console.log("🧹 Cleaning database...");

  // Delete in foreign key dependency order
  await prisma.user_word_progresses.deleteMany();
  await prisma.word_set_words.deleteMany();
  await prisma.word_definitions.deleteMany();
  await prisma.word_sets.deleteMany();
  await prisma.words.deleteMany();
  await prisma.topics.deleteMany();
  
  await prisma.exercise_results.deleteMany();
  await prisma.listening_progresses.deleteMany();
  await prisma.exercises.deleteMany();
  await prisma.study_sessions.deleteMany();

  console.log("✨ Database cleaned successfully!");
}

clean()
  .catch((e) => {
    console.error("❌ Clean failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
