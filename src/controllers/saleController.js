const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.checkout = async (req, res) => {
    const { items, customerName, discount, paymentMethod, total, subtotal } = req.body;
    const invoiceNo = `INV-${Date.now()}`;

    try {
        const result = await prisma.$transaction(async (tx) => {
            // 1. Create the Sale record
            const sale = await tx.sale.create({
                data: {
                    invoiceNo,
                    storeId: req.user.storeId,
                    userId: req.user.id,
                    customerName,
                    subtotal,
                    discount,
                    total,
                    paymentMethod,
                    items: {
                        create: items.map(item => ({
                            productId: item.id,
                            quantity: item.quantity,
                            unitPrice: item.price,
                            totalPrice: item.price * item.quantity
                        }))
                    }
                }
            });

            // 2. Deduct Stock & Create Movement for each item
            for (const item of items) {
                const product = await tx.product.update({
                    where: { id: item.id },
                    data: { quantity: { decrement: item.quantity } }
                });

                if (product.quantity < 0) {
                    throw new Error(`Insufficient stock for ${product.name_en}`);
                }

                await tx.stockMovement.create({
                    data: {
                        productId: item.id,
                        type: 'OUT',
                        quantity: item.quantity,
                        reason: `Sale ${invoiceNo}`
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