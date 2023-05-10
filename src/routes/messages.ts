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

  const contacts = await prisma.user.findMany({
    select: {
      name: true
    }
  });

  const messagesContent = messages.map((message) => message.content)
  const contactsNames = contacts.map((contact) => contact.name)

  res.json([messagesContent, contactsNames]);
});

export default router;

// pull list of all contacts - done
// pull list of all message content for direct messages - done 
// adjust database schema to allow for group messaging - almost done
  // add group id column to message column
  // assign direct messages a null tag in this column 
  // create relation to group table on id
// pull list of all message content for group messages 
  // with contact names instead of sender/recipient