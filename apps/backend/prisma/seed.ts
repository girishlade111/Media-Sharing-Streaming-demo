import 'dotenv/config';
import { prisma } from '../src/services/prisma';
import { AuthService } from '../src/services/auth';
import { FastifyInstance } from 'fastify';

async function seed() {
  console.log('Starting database seed...');

  // Create a mock fastify instance for auth service
  const mockFastify = {
    jwt: {
      sign: (payload: any) => 'mock-token',
    },
  } as unknown as FastifyInstance;

  const authService = new AuthService(mockFastify);

  // Check if admin user exists
  const existingAdmin = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
  });

  if (existingAdmin) {
    console.log('Admin user already exists');
  } else {
    // Create admin user
    const admin = await authService.createUser({
      email: 'admin@example.com',
      username: 'admin',
      password: 'admin123',
      displayName: 'Admin User',
    });

    await prisma.user.update({
      where: { id: admin.id },
      data: { role: 'ADMIN' },
    });

    console.log('Created admin user:');
    console.log('  Email: admin@example.com');
    console.log('  Username: admin');
    console.log('  Password: admin123');
  }

  // Create demo user
  const existingDemo = await prisma.user.findUnique({
    where: { email: 'demo@example.com' },
  });

  if (existingDemo) {
    console.log('Demo user already exists');
  } else {
    const demo = await authService.createUser({
      email: 'demo@example.com',
      username: 'demo',
      password: 'demo123',
      displayName: 'Demo User',
      bio: 'This is a demo account for testing the platform.',
    });

    console.log('Created demo user:');
    console.log('  Email: demo@example.com');
    console.log('  Username: demo');
    console.log('  Password: demo123');
  }

  console.log('Seed completed!');
}

seed()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
