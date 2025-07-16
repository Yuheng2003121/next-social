import { PrismaClient } from "../../generated/prisma";


// 1. 获取全局对象（兼容Node.js和浏览器环境）
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

// 2. 检查全局是否已有实例，没有则新建
export const prisma = globalForPrisma.prisma || new PrismaClient();

// 3. 开发环境下将实例挂载到全局，避免热更新时重复创建
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;