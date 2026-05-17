
import { prisma } from "./lib/prisma";

async function main() {
  console.log("creatnig user test");

  const user = await prisma.user.create({
    data: {
      name: "test_name",
      email: "test@gmail.com",
      password: "123123",
    },
  });
  console.log("User created :", user);
}

main()
  .catch((error) => console.error(error))
  .finally(async () => {
    await prisma.$disconnect();
  });
