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

  const contacts = await prisma.user.findMany({
    select: {
      email: true
    }
  });
  res.json(contacts);

});

// router.get('/', async (req, res) => {
  
// });


export default router;

// pull list of all contacts 
// pull list of all message content for direct messages
// pull list of all message content for group messages 
// with contact names instead of sender/recipient
// adjust database schema to allow for group messaging 
  // add group id column to message column
  // assign direct messages a null tag in this column 
  // create relation to group table on id