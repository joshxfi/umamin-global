import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { nanoid } from "nanoid";

const prisma = new PrismaClient();
async function main() {
  for (let i = 0; i < 10; i++) {
    await prisma.user.create({
      data: {
        username: faker.internet.userName(),
        posts: {
          createMany: {
            data: [
              ...Array.from({ length: 2 }).map(() => ({
                id: nanoid(11),
                content: faker.lorem.paragraph({ min: 1, max: 5 }),
                isAnonymous: faker.datatype.boolean(),
              })),
            ],
          },
        },
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
