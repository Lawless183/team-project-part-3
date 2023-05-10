import express from 'express';
import prisma from '../prisma';
import type { Prisma, Project, Task } from '@prisma/client';

const router = express.Router();

router.get('/user/:userID/projectList', async (req, res) => {

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

router.get('/project/:projectID', async (req, res) => {

    // Reject request if projectID is not a number
    const projectID = Number(req.params.projectID);
    if (isNaN(projectID)) {
        res.json(null);
        return;
    }

    const project = await prisma.project.findFirst({
        where: {
            id: projectID
        },
        include: {
            tasks: true
        }
    });

    // Reject request if project does not exist
    if (project == null) {
        res.json(null);
        return;
    }

    const analysedProject = analyseProject(project);

    res.json(analysedProject);

});

function dateDiffInDays(a: Date, b: Date) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  
    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

type AnalyseProject = {
    project: Project,
    taskData: {
        completed: Number,
        todo: Number,
        ongoing: Number,
        total: Number
    },
    daysToDeadline: Number
};

function analyseProject(project: Project & {tasks: Task[]}): AnalyseProject {

    const taskData = {
        completed: 0,
        todo: 0,
        ongoing: 0,
        total: 0
    };

    for (const i in project.tasks) {
        const task = project.tasks[i];
        // @ts-ignore
        taskData[task.status.toLowerCase()]++;
        taskData.total++;
    }

    const daysToDeadline = dateDiffInDays(new Date(), project.deadline);

    return {
        project,
        taskData,
        daysToDeadline
    };
}

export default router;