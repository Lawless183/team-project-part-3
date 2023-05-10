import express from 'express';
import prisma from '../prisma';

const router = express.Router();


const senderID = 1;
const recipientID = 2;
const messageContent = "This is new content";

router.post('/messages', async (req, res) => {
  console.log('POST req received');
  const newMessage = await prisma.message.create({
    data: {
      senderID: senderID,
      recipientID: recipientID, 
      content: messageContent, 
    },
  });
  res.json(newMessage);
  console.log("Message added: ", newMessage);
});

const user = 1;

router.get('/messages', async (req, res) => {
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
// create post functions 
  // find out how to obtain recipientID 
  // yet to update schema to add groupID to message
  // all direct messages will be given a null marker in this field 
  // all group messages will be given the id of the group its being sent to
