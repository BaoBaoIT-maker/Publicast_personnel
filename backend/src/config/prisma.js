const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Allow both destructuring import (const { prisma } = ...) and direct import (const prisma = ...)
prisma.prisma = prisma;

module.exports = prisma;
