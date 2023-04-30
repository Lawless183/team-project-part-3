import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const user = 1 // this is for testing purposes 

async function getMessages() {
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderID: user },
        { recipientID: user }
      ]
    },
    select: {
      dateTime: true,
      content: true
    }
  });
    return messages;
}

console.log(getMessages());
