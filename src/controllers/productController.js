const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getProducts = async (req, res) => {
    const { search, categoryId } = req.query;
    const products = await prisma.product.findMany({
        where: {
            storeId: req.user.storeId,
            ...(categoryId && { categoryId: parseInt(categoryId) }),
            OR: [
                { name_en: { contains: search || '' } },
                { name_th: { contains: search || '' } },
                { sku: { contains: search || '' } }
            ]
        },
        include: { category: true, images: true }
    });
    res.json(products);
};

exports.createProduct = async (req, res) => {
    try {
        const data = req.body;
        const product = await prisma.product.create({
            data: {
                ...data,
                storeId: req.user.storeId,
                categoryId: parseInt(data.categoryId),
                price: parseFloat(data.price),
                cost: parseFloat(data.cost),
                quantity: parseInt(data.quantity),
                // Create initial stock movement
                movements: {
                    create: {
                        type: 'IN',
                        quantity: parseInt(data.quantity),
                        reason: 'Initial stock'
                    }
                }
            }
        });
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};