const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// =========================
// CHECKOUT
// =========================
exports.checkout = async (req, res) => {
    const { items, customerName, customerId, discount, paymentMethod, totalAmount, finalAmount } = req.body;
    const invoiceNo = `INV-${Date.now()}`;

    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'Cart is empty.' });
    }
    if (!paymentMethod) {
        return res.status(400).json({ message: 'Payment method is required.' });
    }

    try {
        const result = await prisma.$transaction(async (tx) => {

            // 1. Create Sale
            const sale = await tx.sale.create({
                data: {
                    invoiceNo,
                    storeId:      req.user.storeId,
                    userId:       req.user.id,
                    customerName: customerName || null,
                    customerId:   customerId   || null,
                    totalAmount:  totalAmount,
                    discount:     discount     || 0,
                    finalAmount:  finalAmount,
                    paymentMethod,
                    status: 'completed',
                    items: {
                        create: items.map(item => ({
                            productId:  item.id,
                            quantity:   item.quantity,
                            unitPrice:  item.price,
                            totalPrice: item.price * item.quantity
                        }))
                    }
                }
            });

            // 2. Deduct Stock + StockMovement
            for (const item of items) {
                const product = await tx.product.update({
                    where: { id: item.id },
                    data:  { quantity: { decrement: item.quantity } }
                });

                if (product.quantity < 0) {
                    throw new Error(`Insufficient stock for "${product.name_en}"`);
                }

                await tx.stockMovement.create({
                    data: {
                        productId: item.id,
                        type:      'OUT',
                        quantity:  item.quantity,
                        reason:    `Sale ${invoiceNo}`
                    }
                });
            }

            return sale;
        });

        res.status(201).json({ message: 'Sale completed', sale: result });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// =========================
// GET SALES
// =========================
exports.getSales = async (req, res) => {
    try {
        const sales = await prisma.sale.findMany({
            where:   { storeId: req.user.storeId },
            include: { items: { include: { product: true } }, user: true },
            orderBy: { createdAt: 'desc' },
            take:    50
        });
        res.json(sales);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
