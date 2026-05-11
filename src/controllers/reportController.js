const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getDashboardStats = async (req, res) => {
    const storeId = req.user.storeId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
        // 1. Core Summary Stats
        const revenue = await prisma.sale.aggregate({
            _sum: { total: true },
            _count: { id: true },
            where: { storeId }
        });

        const todaySales = await prisma.sale.aggregate({
            _sum: { total: true },
            where: { storeId, createdAt: { gte: today } }
        });

        const lowStockCount = await prisma.product.count({
            where: { 
                storeId, 
                quantity: { lte: prisma.product.fields.alertThreshold } 
            }
        });

        res.json({
            totalRevenue: revenue._sum.total || 0,
            totalOrders: revenue._count.id,
            todayRevenue: todaySales._sum.total || 0,
            lowStockCount
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getRevenueChartData = async (req, res) => {
    // Grouping by date (Simplified for SQLite/Prisma)
    const sales = await prisma.sale.findMany({
        where: { storeId: req.user.storeId },
        select: { total: true, createdAt: true },
        orderBy: { createdAt: 'asc' }
    });
    res.json(sales);
};

exports.getTopProducts = async (req, res) => {
    const topItems = await prisma.saleItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true, totalPrice: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5
    });
    
    // Enrich with product names
    const enriched = await Promise.all(topItems.map(async (item) => {
        const product = await prisma.product.findUnique({ where: { id: item.productId } });
        return { ...item, name_en: product.name_en, name_th: product.name_th };
    }));

    res.json(enriched);
};