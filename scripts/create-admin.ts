/**
 * Create Admin Script
 * Run with: npm run setup:admin
 *
 * This creates or updates the admin user.
 * Uses ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME from environment.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Admin";

  if (!email || !password) {
    console.error("❌ Error: ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment");
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("❌ Error: ADMIN_PASSWORD must be at least 8 characters");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash, name },
    create: { email, passwordHash, name, role: "SUPER_ADMIN" },
  });

  console.log(`\n✅ Admin user created/updated successfully`);
  console.log(`   Name:  ${admin.name}`);
  console.log(`   Email: ${admin.email}`);
  console.log(`   Role:  ${admin.role}`);
  console.log(`\n   Login at: http://localhost:3000/admin/login`);
  console.log("   ⚠️  Change your password after first login!\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
