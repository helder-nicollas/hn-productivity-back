/* eslint-disable no-unused-vars */
import { Task } from '@prisma/client';
import { ICreateTaskDTO } from '../task/dtos/ICreateTaskDTO';
import { IDeleteTaskDTO } from '../task/dtos/IDeleteTaskDTO';
import { IUpdateTaskDTO } from '../task/dtos/IUpdateTaskDTO';
import { IUpdateTasksPositionsDTO } from '../task/dtos/IUpdateTasksPositionsDTO';

export interface ITaskRepository {
    create(data: ICreateTaskDTO): Promise<Task>;
    update(data: IUpdateTaskDTO): Promise<Task>;
    delete(data: IDeleteTaskDTO): Promise<void>;
    updateTasksPositions(data: IUpdateTasksPositionsDTO): Promise<void>;
}
