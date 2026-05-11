const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createPO = async (req, res) => {
    const { supplierId, employeeId, items } = req.body;
    const poNumber = `PO-${Date.now()}`;

    try {
        const po = await prisma.purchaseOrder.create({
            data: {
                poNumber,
                supplierId,
                employeeId,
                totalAmount: items.reduce((sum, i) => sum + (i.quantity * i.cost), 0),
                items: {
                    create: items.map(i => ({
                        productId: i.productId,
                        quantity: i.quantity,
                        cost: i.cost,
                        totalCost: i.quantity * i.cost
                    }))
                }
            }
        });
        res.status(201).json(po);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.receivePO = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.$transaction(async (tx) => {
            // 1. Get the PO and items
            const po = await tx.purchaseOrder.findUnique({
                where: { id: parseInt(id) },
                include: { items: true }
            });

            if (po.status === 'RECEIVED') throw new Error('PO already received');

            // 2. Update PO status
            await tx.purchaseOrder.update({
                where: { id: po.id },
                data: { status: 'RECEIVED' }
            });

            // 3. Increment Stock & Create Movement records
            for (const item of po.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { quantity: { increment: item.quantity } }
                });

                await tx.stockMovement.create({
                    data: {
                        productId: item.productId,
                        type: 'IN',
                        quantity: item.quantity,
                        reason: `Received PO: ${po.poNumber}`
                    }
                });
            }
        });

        res.json({ message: 'Inventory updated successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};