import express from 'express';
import prisma from '../prisma';

const router = express.Router();

router.get('/', async (req, res) => {
    const users = await prisma.user.findMany({
        include: {
            recievedMessages: true,
            sentMessages: true,
            groups: true
        }
    });
    res.json(users);
});

router.get('/test', async (req, res) => {
    await prisma.message.create({
        data: {
            content: 'test',
            date: new Date(),
            time: '1',
            recipientID: 1,
            senderID: 2
        }
    });
    res.json('done');
});

router.get('/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
        res.json(null);
        return;
    }
    const user = await prisma.user.findFirst({
        where: {
            id: {
                equals: id
            }
        },
        include: {
            recievedMessages: true,
            sentMessages: true,
            groups: true
        }
    });
    res.json(user);
});

export default router;