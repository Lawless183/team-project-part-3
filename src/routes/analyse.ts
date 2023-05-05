import express from 'express';
import prisma from '../prisma';
import type { Prisma } from '@prisma/client';

const router = express.Router();

router.get('/projects/:userID', async (req, res) => {

    // Reject request if userID is not a number
    const userID = Number(req.params.userID);
    if (isNaN(userID)) {
        res.json(null);
        return;
    }

    // Reject request if user does not exist
    const user = await prisma.user.findFirst({
        where: {
            id: {
                equals: userID
            }
        }
    });
    if (user == null) {
        res.json(null);
        return;
    }

    // Include tasks with project
    const find: {
        include: Prisma.ProjectInclude,
        where?: Prisma.ProjectWhereInput
    } = {
        include: {
            tasks: user.isManager ? true : { // show all tasks if manager
                where: {
                    OR: [
                        {
                            userID // only show user's tasks
                        },
                        {
                            project: {
                                teamLeaderID: userID // show all tasks if team leader
                            }
                        }
                    ]
                },
                include: {
                    category: true
                }
            },
        }
    };

    // If the user is not a manager only show projects they lead or have tasks in
    if (!user.isManager) {
        find.where = {
            OR: [
                {
                    tasks: {
                        some: {
                            userID: {
                                equals: userID
                            }
                        }
                    }
                },
                {
                    teamLeaderID: userID
                }
            ]
        }
    }

    const project = await prisma.project.findMany(find);
    res.json(project);
});

export default router;