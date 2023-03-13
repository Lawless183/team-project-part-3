import express from 'express';
import prisma from './prisma';
import userRoutes from './routes/user';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.SERVER_PORT || 3000;

const app = express();

app.use('/user', userRoutes);

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