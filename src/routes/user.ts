import express from 'express';
import prisma from '../prisma';

const router = express.Router();

router.get('/', async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
});

router.post('/test', async (req, res) => {
    await prisma.user.create({
        data: {
            name: 'test',
            email: 'test@domain.com'
        }
    });
    const users = await prisma.user.findMany();
    res.json(users);
});

export default router;