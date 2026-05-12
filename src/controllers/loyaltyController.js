const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Logic to earn points (e.g., ฿100 = 1 Point)
exports.processLoyaltyEarn = async (customerId, amount) => {
    const pointsEarned = Math.floor(amount / 100);
    
    return await prisma.$transaction(async (tx) => {
        // 1. Update Customer Totals
        const customer = await tx.customer.update({
            where: { id: customerId },
            data: {
                points: { increment: pointsEarned },
                totalSpend: { increment: amount }
            }
        });

        // 2. Auto-Tier Upgrade Logic
        let newTier = "BRONZE";
        if (customer.totalSpend >= 50000) newTier = "VIP";
        else if (customer.totalSpend >= 20000) newTier = "GOLD";
        else if (customer.totalSpend >= 5000) newTier = "SILVER";

        if (newTier !== customer.tier) {
            await tx.customer.update({
                where: { id: customerId },
                data: { tier: newTier }
            });
        }

        // 3. Log Activity
        await tx.loyaltyPoint.create({
            data: { customerId, points: pointsEarned, reason: `Earned from purchase` }
        });
    });
};