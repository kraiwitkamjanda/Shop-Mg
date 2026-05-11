const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const store = await prisma.store.create({
        data: {
            name: 'Main HQ'
        }
    });

    const hash = await bcrypt.hash('admin123', 10);

    await prisma.user.create({
        data: {
            username: 'owner_admin',
            passwordHash: hash,
            role: 'owner',
            storeId: store.id
        }
    });

    console.log('Seed done!');
}

main();