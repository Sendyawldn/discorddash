"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
// Assuming we run from the bot directory, we import the Prisma Client generated in the web workspace
const client_1 = require("../../discorddash-web/node_modules/@prisma/client");
// Prevent multiple instances of Prisma Client in development
const globalForPrisma = globalThis;
exports.prisma = globalForPrisma.prisma ?? new client_1.PrismaClient();
if (process.env.NODE_ENV !== 'production')
    globalForPrisma.prisma = exports.prisma;
//# sourceMappingURL=db.js.map