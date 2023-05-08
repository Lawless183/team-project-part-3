import express from 'express';
import prisma from '../prisma';

const router = express.Router();

const user = 1;

// router.get('/', async (req, res) => {
//   const messages = await prisma.message.findMany({
//     where: {
//       OR: [
//         { senderID: user },
//         { recipientID: user }
//       ]
//     }
//   });
//   res.json(messages);
// });
  

// router.get('/', async (req, res) => {
//   const contacts = await prisma.user.findMany({
//     select: {
//       name: true
//     }
//   });
//   res.json(contacts);
// });

// Route for retrieving names from the User table
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        name: true,
      },
    });

    res.json(users);
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route for retrieving rows from the Messages table
router.get('/messages', async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderID: user },
          { recipientID: user }
        ]
      }
    });

    res.json(messages);
  } catch (error) {
    console.error('Error retrieving messages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

// pull list of all contacts 
// pull list of all message content for direct messages
// pull list of all message content for group messages 
// with contact names instead of sender/recipient
// adjust database schema to allow for group messaging 
  // add group id column to message column
  // assign direct messages a null tag in this column 
  // create relation to group table on id