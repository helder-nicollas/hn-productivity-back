import { Task } from '@prisma/client';

export interface IUpdateTasksPositionsDTO {
    sourceSectionId: string;
    destinationSectionId: string;
    sourceTasksList: Task[];
    destinationTasksList: Task[];
}
