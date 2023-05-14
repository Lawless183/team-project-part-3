import express from 'express';
import prisma from '../prisma';
import { group } from 'console';

const router = express.Router();

//get direct messages or messages from a group and all contacts
router.get('/messages/:userID/:groupID', async (req, res) => {
  const userID= Number(req.params.userID);
  var groupID = Number(req.params.groupID);

  if(groupID == undefined){
    groupID = -1;
  }


  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderID: userID },
        { recipientID: userID }, 
        { groupID: groupID },
      ]
    }
  });

  const contacts = await prisma.user.findMany({
    select: {
      id: true,
      name: true
    }
  });

  const messagesContent = messages.map((message) => [message.content, message.senderID, message.recipientID])
  const contactsMap = contacts.map((contact) => [contact.name, contact.id])

  res.json([messagesContent, contactsMap]);
});
//load groups
router.get('/group/:userID', async (req, res) => {
  const userID = Number(req.params.userID);
  const groupChats = await prisma.group.findMany({
    where: {
      users: {
        some: {
          id: userID,
        },
      },
    },
    include: {
      Message :true,
      users: true
    }
  });
  res.json(groupChats)
});

router.post('/messages/:senderID/:recipientID/:groupID/:content', async (req, res) => {
  const senderID = Number(req.params.senderID);
  var recipientID = Number(req.params.recipientID);
  var groupID = Number(req.params.groupID);
  const content = req.params.content;
  var newMessage;
  if(Number.isNaN(groupID) || groupID == undefined){
    console.log("hello");
    const newMessage = await prisma.message.create({
      data: {
        senderID: senderID,
        recipientID: recipientID,
        groupID: null,
        content: content,
      },
    });
  }
  else{
    const newMessage = await prisma.message.create({
      data: {
        senderID: senderID,
        recipientID: null,
        groupID: groupID,
        content: content,
      },
    });
  }
  res.json(newMessage);
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
