import { Request, Response } from 'express';
import { ITaskRepository } from '../repositories/types/task';
import { NotFoundError } from '../helpers/api-errors';
import { IBoardRepostiory } from '../repositories/types/board';

export class TaskController {
    constructor(
        private repository: ITaskRepository,
        private boardRepository: IBoardRepostiory,
    ) {
        this.repository = repository;
        this.boardRepository = boardRepository;
    }

    public async create(req: Request, res: Response) {
        const { sectionId } = req.params;

        const newTask = await this.repository.create({ sectionId });

        res.status(200).json(newTask);
    }

    public async update(req: Request, res: Response) {
        const { title, content, color } = req.body;
        const { taskId, boardId } = req.params;
        const userId = req.user!.user_id;

        const board = await this.boardRepository.findOne({ boardId, userId });

        if (!board) throw new NotFoundError('Board not found!');

        const updatedTask = await this.repository.update({
            title,
            content,
            taskId,
            color,
        });

        res.status(200).json(updatedTask);
    }

    public async delete(req: Request, res: Response) {
        const { taskId, sectionId, boardId } = req.params;
        const userId = req.user!.user_id;

        const board = await this.boardRepository.findOne({ boardId, userId });

        if (!board) throw new NotFoundError('Board not found!');

        await this.repository.delete({ taskId, sectionId });

        res.status(200).json({ message: 'Task succesfully deleted' });
    }

    public async updateTasksPositions(req: Request, res: Response) {
        const {
            sourceSectionId,
            destinationSectionId,
            sourceTasksList,
            destinationTasksList,
        } = req.body;

        await this.repository.updateTasksPositions({
            destinationSectionId,
            destinationTasksList,
            sourceSectionId,
            sourceTasksList,
        });

        res.status(200).json({ message: 'Updated' });
    }
}
