import express from 'express';
import prisma from './prisma';
import userRoutes from './routes/user';
<<<<<<< HEAD
import messagesRoutes from './routes/messages';
=======
import analyseRoutes from './routes/analyse';
>>>>>>> master
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const port = process.env.SERVER_PORT || 3000;

const app = express();

app.use(cors());

app.use('/user', userRoutes);
<<<<<<< HEAD
app.use('/', messagesRoutes);
=======
app.use('/analyse', analyseRoutes);
>>>>>>> master

async function main() {
    app.listen(port, () => console.log(`Server running on port ${port}`));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });