import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 1. Create SUPER_ADMIN
  const email = process.env.SUPER_ADMIN_EMAIL || 'admin@barobar.com';
  const password = process.env.SUPER_ADMIN_PASSWORD || 'admin123';

  const existingSuperAdmin = await prisma.user.findUnique({
    where: { email },
  });

  if (existingSuperAdmin) {
    console.log(`SUPER_ADMIN already exists: ${email}`);
  } else {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name: 'Super Admin',
        email,
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        hotelId: null,
      },
    });
    console.log(`SUPER_ADMIN created: ${user.email} (id: ${user.id})`);
  }

  // 2. Create demo hotel
  const existingHotel = await prisma.hotel.findUnique({
    where: { slug: 'demo-hotel' },
  });

  if (existingHotel) {
    console.log(`Demo hotel already exists: ${existingHotel.name}`);
    return;
  }

  const hotel = await prisma.hotel.create({
    data: {
      name: 'Demo Hotel',
      slug: 'demo-hotel',
      description: 'A demo hotel for testing',
      address: '123 Demo Street, Mumbai, India',
      currency: 'INR',
      timezone: 'Asia/Kolkata',
    },
  });
  console.log(`Demo hotel created: ${hotel.name} (id: ${hotel.id})`);

  // 3. Create BASIC subscription for demo hotel
  await prisma.subscription.create({
    data: {
      hotelId: hotel.id,
      plan: 'BASIC',
      status: 'ACTIVE',
    },
  });
  console.log(`BASIC subscription created for ${hotel.name}`);

  // 4. Create demo ADMIN user for the hotel
  const adminEmail = 'admin@demo-hotel.com';
  const adminPassword = await bcrypt.hash('admin123', 12);

  await prisma.user.create({
    data: {
      name: 'Demo Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'ADMIN',
      hotelId: hotel.id,
    },
  });
  console.log(`Demo ADMIN created: ${adminEmail}`);

  // 5. Create demo MANAGER user for the hotel
  const managerEmail = 'manager@demo-hotel.com';
  const managerPassword = await bcrypt.hash('manager123', 12);

  await prisma.user.create({
    data: {
      name: 'Demo Manager',
      email: managerEmail,
      password: managerPassword,
      role: 'MANAGER',
      hotelId: hotel.id,
    },
  });
  console.log(`Demo MANAGER created: ${managerEmail}`);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
