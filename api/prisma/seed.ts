import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  // --- Validate ENV Variables ---
  const email = process.env.SUPERADMIN_EMAIL;
  const password = process.env.SUPERADMIN_PASSWORD;
  const enabled = process.env.SUPERADMIN_ENABLED === 'true';

  if (!enabled) {
    console.log('⚠️ SUPERADMIN creation is disabled. Skipping...');
    return;
  }

  if (!email || !password) {
    throw new Error(
      '❌ Missing SUPERADMIN_EMAIL or SUPERADMIN_PASSWORD in .env. Cannot continue.',
    );
  }

  console.log('🔍 Checking for existing SuperAdmin...');

  const existing = await prisma.user.findFirst({
    where: { role: 'SUPERADMIN' },
  });

  if (existing) {
    console.log('✅ SuperAdmin already exists. Skipping creation.');
    return;
  }

  console.log('🔐 Creating initial SuperAdmin user...');

  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: 'SUPERADMIN',
    },
  });

  console.log('🎉 SuperAdmin created successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
