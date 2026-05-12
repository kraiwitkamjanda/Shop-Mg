const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();


// =========================
// GET PRODUCTS
// =========================
exports.getProducts = async (req, res) => {

    try {

        const { search, categoryId } = req.query;

        const products = await prisma.product.findMany({

            where: {

                storeId: req.user.storeId,

                ...(categoryId && {
                    categoryId: parseInt(categoryId)
                }),

                OR: [
                    {
                        name_en: {
                            contains: search || ''
                        }
                    },
                    {
                        name_th: {
                            contains: search || ''
                        }
                    },
                    {
                        sku: {
                            contains: search || ''
                        }
                    }
                ]
            },

            include: {
                category: true,
                images: true
            }

        });

        res.json(products);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};


// =========================
// CREATE PRODUCT
// =========================
exports.createProduct = async (req, res) => {

    try {

        const data = req.body;

        const product = await prisma.product.create({

            data: {

                ...data,

                storeId: req.user.storeId,

                categoryId: parseInt(data.categoryId),

                price: parseFloat(data.price || 0),

                cost: parseFloat(data.cost),

                cost: parseFloat(data.cost || 0),

                // Initial stock movement
                movements: {
                    create: {
                        type: 'IN',
                        quantity: parseInt(data.quantity || 0),
                        reason: 'Initial stock'
                    }
                }

            }

        });

        res.status(201).json(product);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};


// =========================
// UPDATE PRODUCT
// =========================
exports.updateProduct = async (req, res) => {

    try {

        const productId = parseInt(req.params.id);

        const data = req.body;

        const updatedProduct = await prisma.product.update({

            where: {
                id: productId
            },

            data: {

                ...data,

                ...(data.categoryId && {
                    categoryId: parseInt(data.categoryId)
                }),

                ...(data.price && {
                    price: parseFloat(data.price)
                }),

                ...(data.cost && {
                    cost: parseFloat(data.cost)
                }),

                ...(data.quantity && {
                    quantity: parseInt(data.quantity)
                })

            }

        });

        res.json(updatedProduct);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};


// =========================
// DELETE PRODUCT
// =========================
exports.deleteProduct = async (req, res) => {

    try {

        const productId = parseInt(req.params.id);

        await prisma.product.delete({

            where: {
                id: productId
            }

        });

        res.json({
            message: 'Product deleted successfully'
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};