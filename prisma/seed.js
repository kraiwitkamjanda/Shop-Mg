const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {

    // 1. สร้าง Store
    const store = await prisma.store.upsert({
        where: { id: 1 },
        update: {},
        create: {
            name: 'Garden Shop สาขาหลัก',
            location: 'Bangkok'
        }
    });

    console.log('✅ Store created:', store.name);

    // 2. สร้าง Owner User
    const passwordHash = await bcrypt.hash('admin1234', 10);

    const user = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            passwordHash,
            role: 'owner',
            storeId: store.id
        }
    });

    console.log('✅ User created:', user.username, '| role:', user.role, '| storeId:', user.storeId);

    // 3. สร้าง Category ตัวอย่าง
    const categories = ['ต้นไม้', 'ดอกไม้', 'ปุ๋ย', 'อุปกรณ์จัดสวน'];

    for (const name of categories) {
        await prisma.category.upsert({
            where: { id: categories.indexOf(name) + 1 },
            update: {},
            create: {
                name_th: name,
                name_en: name
            }
        });
    }

    console.log('✅ Categories created:', categories.join(', '));
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });