import { ITaskRepository } from '../types/task';
import { ICreateTaskDTO } from './dtos/ICreateTaskDTO';
import { IUpdateTaskDTO } from './dtos/IUpdateTaskDTO';
import { IDeleteTaskDTO } from './dtos/IDeleteTaskDTO';
import { IUpdateTasksPositionsDTO } from './dtos/IUpdateTasksPositionsDTO';
import { database } from '../../database';

export class TaskRepository implements ITaskRepository {
    public async create(data: ICreateTaskDTO) {
        const tasksQuantity = await this.countSectionTasks(data.sectionId);

        const newTask = await database.task.create({
            data: {
                section_id: data.sectionId,
                position: tasksQuantity > 0 ? tasksQuantity : 0,
            },
        });

        return newTask;
    }

    private async countSectionTasks(sectionId: string) {
        const quantity = await database.task.count({
            where: {
                section_id: sectionId,
            },
        });

        return Number(quantity);
    }

    public async update(data: IUpdateTaskDTO) {
        const updatedTask = database.task.update({
            data: {
                title: data.title,
                content: data.content,
                color: data.color,
            },
            where: {
                task_id: data.taskId,
            },
        });

        return updatedTask;
    }

    public async delete(data: IDeleteTaskDTO) {
        await database.$transaction(async context => {
            await database.task.delete({
                where: {
                    task_id: data.taskId,
                },
            });

            const tasks = await database.task.findMany({
                where: {
                    section_id: data.sectionId,
                },
            });

            for (const key in tasks) {
                await context.task.update({
                    where: { task_id: tasks[key].task_id },
                    data: {
                        position: Number(key),
                    },
                });
            }
        });
    }

    public async updateTasksPositions({
        destinationSectionId,
        destinationTasksList,
        sourceSectionId,
        sourceTasksList,
    }: IUpdateTasksPositionsDTO) {
        await database.$transaction(async context => {
            if (sourceSectionId != destinationSectionId) {
                for (const key in sourceTasksList) {
                    await context.task.update({
                        data: {
                            position: Number(key),
                        },
                        where: {
                            task_id: sourceTasksList[key].task_id,
                        },
                    });
                }
            }

            for (const key in destinationTasksList) {
                await context.task.update({
                    data: {
                        section_id: destinationSectionId,
                        position: Number(key),
                    },
                    where: {
                        task_id: destinationTasksList[key].task_id,
                    },
                });
            }
        });
    }
}
