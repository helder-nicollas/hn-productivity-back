import { Request, Response } from 'express';

import { ISectionRepository } from '../repositories/types/section';

export class SectionController {
    constructor(private repository: ISectionRepository) {
        this.repository = repository;
    }

    public async create(req: Request, res: Response) {
        const { boardId } = req.params;
        const { title } = req.body;
        const userId = req.user!.user_id;
        const section = await this.repository.create({
            boardId,
            userId,
            title,
        });
        res.status(200).json(section);
    }

    public async update(req: Request, res: Response) {
        const { sectionId } = req.params;
        const { title } = req.body;

        const section = await this.repository.update({
            sectionId,
            title,
        });
        res.status(200).json(section);
    }

    public async deleteSection(req: Request, res: Response) {
        const { sectionId } = req.params;

        await this.repository.delete({ sectionId });
        res.status(200).json({ message: 'Section sucessfully deleted' });
    }
}
