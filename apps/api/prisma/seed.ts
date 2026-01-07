import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Minimal champions (add more later)
  const champions = [
    { id: 51, name: 'Caitlyn' },
    { id: 22, name: 'Ashe' },
    { id: 412, name: 'Thresh' },
    { id: 267, name: 'Nami' },
    { id: 64, name: 'Lee Sin' },
    { id: 81, name: 'Ezreal' },
  ];

  for (const c of champions) {
    await prisma.champion.upsert({
      where: { id: c.id },
      create: c,
      update: { name: c.name },
    });
  }

  const tags = [
    { name: 'Calmo', category: 'Mental' },
    { name: 'Shotcaller', category: 'Comunicação' },
    { name: 'Objetivos', category: 'Macro' },
    { name: 'Agressivo early', category: 'Estilo' },
    { name: 'Prefere voice', category: 'Comunicação' },
  ];

  for (const t of tags) {
    await prisma.tag.upsert({
      where: { name: t.name },
      create: t,
      update: { category: t.category },
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
