import express from 'express';
import prisma from '../prisma';
import type { Prisma, Project, Task, TaskCategory, User } from '@prisma/client';

const router = express.Router();

router.get('/user/:userID/projects', async (req, res) => {

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
            tasks: user.isManager ? {
                include: {
                    category: true
                }
            } : { // show all tasks if manager
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

    const projects = await prisma.project.findMany(find);

    // @ts-ignore
    const analysedProjects = projects.map(analyseProject);

    const analysedProjectsWithUsers = await Promise.all(analysedProjects.map(async project => {

        if (!project.tasks || !((project.teamLeaderID == userID) || user.isManager)) return project;

        const users = await prisma.user.findMany({
            where: {
                id: {
                    in: project.tasks.map(task => task.userID)
                }
            }
        });

        return {
            ...project,
            users
        };
    }));

    res.json(analysedProjectsWithUsers);
});

router.get('/user/:userID/tasks', async (req, res) => {

    // Reject request if userID is not a number
    const userID = Number(req.params.userID);
    if (isNaN(userID)) {
        res.json(null);
        return;
    }

    const projectID = Number(req.query.project);

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

    const find: {
        where: Prisma.TaskWhereInput,
        include: Prisma.TaskInclude
    } = {
        where: {
            userID
        },
        include: {
            category: true
        }
    };

    if (!isNaN(projectID)) {
        find.where.projectID = projectID
    };

    const tasks = await prisma.task.findMany(find);

    res.json({
        // @ts-ignore
        ...countTasks(tasks),
        tasks
    });

});

function dateDiffInDays(a: Date, b: Date) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

type AnalyseProject = Project & {
    teamLeader?: User | undefined,
    tasks?: (Task & {category: TaskCategory})[] | undefined,
    taskData: {
        completed: Number,
        todo: Number,
        ongoing: Number
    },
    categoryData: any,
    daysToDeadline: Number
};

function analyseProject(project: Project & {
    teamLeader?: User | undefined,
    tasks?: (Task & {category: TaskCategory})[] | undefined
}): AnalyseProject {

    const { taskData, categoryData } = countTasks(project.tasks);

    const daysToDeadline = dateDiffInDays(new Date(), project.deadline);

    return {
        ...project,
        taskData,
        categoryData,
        daysToDeadline
    };
}

function countTasks(tasks: (Task & {category: TaskCategory})[] | undefined) : {
    taskData: {
        completed: number,
        todo: number,
        ongoing: number
    },
    categoryData: any
} {

    const taskData = {
        completed: 0,
        todo: 0,
        ongoing: 0
    };

    const categoryData = {};

    if (tasks) {

        for (const i in tasks) {
            const task = tasks[i];
            // @ts-ignore
            taskData[task.status.toLowerCase()]++;
            if (Object.keys(categoryData).includes(task.category.category)) {
                // @ts-ignore
                categoryData[task.category.category]++;
            }
            else {
                // @ts-ignore
                categoryData[task.category.category] = 1;
            }
        }

    }

    return { taskData, categoryData };
}

export default router;