import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

export class DatabaseHealth {
  private static prisma = new PrismaClient();

  static async checkConnection(): Promise<{ connected: boolean; error?: string }> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { connected: true };
    } catch (error: any) {
      logger.error('Database connection failed', { error: error.message });
      return { connected: false, error: error.message };
    }
  }

  static async getStats() {
    try {
      const tables = await this.prisma.$queryRaw`
        SELECT schemaname, tablename, n_tup_ins as inserts, n_tup_upd as updates, n_tup_del as deletes
        FROM pg_stat_user_tables
        WHERE schemaname = 'public'
      `;

      return { tables };
    } catch (error: any) {
      logger.error('Error getting database stats', { error: error.message });
      return { error: error.message };
    }
  }

  static async disconnect() {
    try {
      await this.prisma.$disconnect();
      logger.info('Database connection closed');
    } catch (error: any) {
      logger.error('Error disconnecting from database', { error: error.message });
    }
  }
}
