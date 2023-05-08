// import { PrismaClient } from '@prisma/client'

// const prisma = new PrismaClient()

// const user = 1 // this is for testing purposes 

// async function getMessages() {
//   const messages = await prisma.message.findMany({
//     where: {
//       OR: [
//         { senderID: user },
//         { recipientID: user }
//       ]
//     },
//     select: {
//       dateTime: true,
//       content: true
//     }
//   });
//     return messages;
// }

// console.log(getMessages());

import express from 'express';
import prisma from '../prisma';

const router = express.Router();

const user = 1;

router.get('/', async (req, res) => {
  // const messages = await prisma.message.findMany({
  //   where: {
  //     OR: [
  //       { senderID: user },
  //       { recipientID: user }
  //     ]
  //   },
  //   select: {
  //     dateTime: true,
  //     content: true
  //   }
  // });
  // res.json(messages);
  const users = await prisma.user.findMany({
    include: {
        recievedMessages: true,
        sentMessages: true,
        groups: true
    }
  });
  res.json(users);
})

export default router;