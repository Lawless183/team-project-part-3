import express from 'express';
import prisma from '../prisma';

const router = express.Router();

const user = 1;

router.get('/', async (req, res) => {
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderID: user },
        { recipientID: user }
      ]
    }
  });
  res.json(messages);
});

export default router;
