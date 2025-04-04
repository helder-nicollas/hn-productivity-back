import { Request, Response } from 'express';

import { ISectionRepository } from '../repositories/types/section';
import { IBoardRepostiory } from '../repositories/types/board';
import { NotFoundError } from '../helpers/api-errors';

export class SectionController {
    constructor(
        private repository: ISectionRepository,
        private boardRepository: IBoardRepostiory,
    ) {
        this.repository = repository;
        this.boardRepository = boardRepository;
    }

    public async create(req: Request, res: Response) {
        const { boardId } = req.params;
        const { title } = req.body;
        const section = await this.repository.create({
            boardId,
            title,
        });
        res.status(200).json(section);
    }

    public async update(req: Request, res: Response) {
        const { sectionId, boardId } = req.params;
        const { title } = req.body;
        const userId = req.user!.user_id;

        const board = await this.boardRepository.findOne({
            boardId,
            userId,
        });

        if (!board) throw new NotFoundError('Board not found!');

        const section = await this.repository.update({
            sectionId,
            title,
        });
        res.status(200).json(section);
    }

    public async delete(req: Request, res: Response) {
        const { sectionId, boardId } = req.params;
        const userId = req.user!.user_id;

        const board = await this.boardRepository.findOne({
            boardId,
            userId,
        });

        if (!board) throw new NotFoundError('Board not found!');

        await this.repository.delete({ sectionId });
        res.status(200).json({ message: 'Section sucessfully deleted' });
    }
}
