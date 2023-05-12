import express from 'express';
import prisma from '../prisma';
import { group } from 'console';

const router = express.Router();

router.get('/messages', async (req, res) => {
  const userID = 1;
  // const {userID, groupID} = req.body;
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderID: userID },
        { recipientID: userID }, 
        // { groupID: groupID },
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

router.get('/group', async (req, res) => {
  // const userID = req.body;
  const userID = 1;
  const groupChats = await prisma.group.findMany({
    where: {
      users: {
        some: {
          id: userID,
        },
      },
    },
  });
  res.json(groupChats)
});

router.post('/messages', async (req, res) => {
  const {senderID, recipientID, groupID, content} = req.body;
  const newMessage = await prisma.message.create({
    data: {
      senderID: senderID,
      recipientID: recipientID,
      // groupID: groupID;
      content: content,
    },
  });
  res.json(newMessage);
  console.log("Message added: ", newMessage);
});

router.post('/group', async (req, res) => {
  const {name, userID} = req.body;
  const newGroup = await prisma.group.create({
    data: {
      name: name,
      users: userID,
    },
  });
  res.json(newGroup.id);
});

router.post('/group/users', async (req, res) => {
  const {groupID, user} = req.body;
  const updateUsers = await prisma.group.update({
    where:{
      id: Number(groupID),
    },
    data: {
      users: {
        connect: {
          id: user,
        },
      },
    },
  });
  res.json(updateUsers);
});


export default router;

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
// create new groups and add members to those groups

// no longer need sender/recipient IDs (hard code them and make it work)
// turn post into a function rather than an onload execution
// drag some element contents from front end  
// create new group function 
  // button to make new group with only the creator 
  // add contact to group button, one by one 
  // contact id gets passed through to a post function
  // contact id added to group in group table
