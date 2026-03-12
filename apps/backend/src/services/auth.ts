import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from './prisma';
import { logger } from '../utils/logger';
import type { FastifyInstance } from 'fastify';

export interface CreateUserInput {
  email: string;
  username: string;
  password: string;
  displayName?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface TokenPayload {
  sub: string;
  email: string;
  username: string;
  role: string;
}

export class AuthService {
  constructor(private fastify: FastifyInstance) {}

  /**
   * Hash a password
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  /**
   * Compare password with hash
   */
  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Create a new user
   */
  async createUser(input: CreateUserInput) {
    const passwordHash = await this.hashPassword(input.password);

    const user = await prisma.user.create({
      data: {
        email: input.email.toLowerCase(),
        username: input.username.toLowerCase(),
        passwordHash,
        displayName: input.displayName || input.username,
      },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        bio: true,
        avatarUrl: true,
        coverUrl: true,
        role: true,
        createdAt: true,
      },
    });

    logger.info({ userId: user.id, email: user.email }, 'User created');
    return user;
  }

  /**
   * Authenticate user and return tokens
   */
  async login(input: LoginInput, userAgent?: string, ipAddress?: string) {
    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    if (user.isBanned) {
      throw new Error(`Account banned: ${user.banReason || 'No reason provided'}`);
    }

    const isValid = await this.comparePassword(input.password, user.passwordHash);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    // Generate tokens
    const accessToken = this.fastify.jwt.sign({
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    } as TokenPayload);

    const refreshToken = uuidv4();
    const refreshTokenHash = await this.hashPassword(refreshToken);

    // Create session
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await prisma.session.create({
      data: {
        userId: user.id,
        tokenHash: await this.hashPassword(accessToken),
        refreshToken: refreshTokenHash,
        userAgent: userAgent || null,
        ipAddress: ipAddress || null,
        expiresAt,
      },
    });

    logger.info({ userId: user.id }, 'User logged in');

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        coverUrl: user.coverUrl,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(refreshToken: string) {
    const sessions = await prisma.session.findMany({
      where: {
        refreshToken: { not: null },
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    let validSession = null;
    for (const session of sessions) {
      const isValid = await this.comparePassword(
        refreshToken,
        session.refreshToken!
      );
      if (isValid) {
        validSession = session;
        break;
      }
    }

    if (!validSession) {
      throw new Error('Invalid refresh token');
    }

    const user = validSession.user;

    const newAccessToken = this.fastify.jwt.sign({
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    } as TokenPayload);

    // Rotate refresh token
    const newRefreshToken = uuidv4();
    const newRefreshTokenHash = await this.hashPassword(newRefreshToken);

    await prisma.session.update({
      where: { id: validSession.id },
      data: {
        tokenHash: await this.hashPassword(newAccessToken),
        refreshToken: newRefreshTokenHash,
      },
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  /**
   * Logout user (invalidate session)
   */
  async logout(accessToken: string): Promise<void> {
    const tokenHash = await this.hashPassword(accessToken);
    await prisma.session.deleteMany({
      where: { tokenHash },
    });
  }

  /**
   * Logout all sessions for a user
   */
  async logoutAll(userId: string): Promise<void> {
    await prisma.session.deleteMany({
      where: { userId },
    });
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        bio: true,
        avatarUrl: true,
        coverUrl: true,
        role: true,
        createdAt: true,
      },
    });
  }

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    data: {
      displayName?: string;
      bio?: string;
      avatarUrl?: string;
      coverUrl?: string;
    }
  ) {
    return prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        bio: true,
        avatarUrl: true,
        coverUrl: true,
        role: true,
        createdAt: true,
      },
    });
  }
}
