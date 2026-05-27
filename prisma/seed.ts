//  creation de données aléatoires 
//  npx tsx prisma/seed.ts

import { InvoiceStatus, PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { hash } from "bcrypt";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding...");

  //Clean
  await prisma.invoice.deleteMany();
  await prisma.client.deleteMany();
  await prisma.user.deleteMany();

  //Users avatars dir / files
  const usersAvatarsDir = path.join(
    process.cwd(),
    "public/uploads/avatars/users",
  );
  const usersAvatarsFiles = fs.readdirSync(usersAvatarsDir); //[profile1.webp, profile2.webp....]

  //Users
  const users = [];
  for (let i = 0; i < 5; i++) {
    const plainPass = faker.internet.password({ length: 10 });
    const hashedPass = await hash(plainPass, 10);
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email().toLowerCase(),
        password: hashedPass,
        name: faker.person.fullName(),
        avatarUrl:
          "/uploads/avatars/users/" +
          faker.helpers.arrayElement(usersAvatarsFiles),
      },
    });
    users.push({ ...user, plainPass });
  }

  //Give the plain passwords:
  users.forEach((user) => console.log(user.email, "-", user.plainPass));

  //Clients avatars dir / files
  const clientsAvatarsDir = path.join(
    process.cwd(),
    "public/uploads/avatars/clients",
  );
  const clientsAvatarsFile = fs.readdirSync(clientsAvatarsDir); //[avatar1.webp, avatar2.webp....]

  //For each user, make clients and invoices
  for (const user of users) {
    //Create Clients per user
    const clients = [];
    for (let i = 0; i < faker.number.int({ min: 5, max: 7 }); i++) {
      const client = await prisma.client.create({
        data: {
          name: faker.company.name(),
          email: faker.internet.email(),
          userId: user.id,
          avatarUrl:
            "/uploads/avatars/clients/" +
            faker.helpers.arrayElement(clientsAvatarsFile),
        },
      });
      clients.push(client);
    }
    //Now create invoices per user
    const now = new Date();
    const twoYearsAgo = new Date().setFullYear(now.getFullYear() - 2);
    let invoiceNumber = 1;
    for (let i = 1; i < faker.number.int({ min: 10, max: 40 }); i++) {
      const client = faker.helpers.arrayElement(clients);
      const createdAt = faker.date.between({ from: twoYearsAgo, to: now });
      const dueDate = faker.date.between({
        from: createdAt,
        to: new Date(createdAt.getTime() + 60 * 24 * 60 * 60 * 1000),
      }); //dueDate between createdAt date and max 60 days more
      await prisma.invoice.create({
        data: {
          number: invoiceNumber++,
          amount: faker.number.float({
            min: 100,
            max: 5000,
            fractionDigits: 2,
          }),
          status: faker.helpers.arrayElement([
            InvoiceStatus.DRAFT,
            InvoiceStatus.OVERDUE,
            InvoiceStatus.SENT,
            InvoiceStatus.PAID,
          ]),
          createdAt,
          dueDate,
          userId: user.id,
          clientId: client.id,
        },
      });
    }
  }

  console.log("✅ Seed terminé");
}

main()
  .then(() => console.log("✅ Done"))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
