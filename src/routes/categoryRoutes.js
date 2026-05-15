const express = require('express');

const router = express.Router();

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();


// GET ALL CATEGORIES
router.get('/', async (req, res) => {

    try {

        const categories = await prisma.category.findMany();

        res.json(categories);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});


// CREATE CATEGORY
router.post('/', async (req, res) => {

    try {

        const category = await prisma.category.create({
            data: req.body
        });

        res.json(category);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});

module.exports = router;