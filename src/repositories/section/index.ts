import { ISectionRepository } from '../types/section';
import { ICreateSectionDTO } from './dtos/ICreateSectionDTO';
import { IDeleteSectionDTO } from './dtos/IDeleteSectionDTO';
import { IUpdateSectionDTO } from './dtos/IUpdateSectionDTO';
import { database } from '../../database';

export class SectionRepository implements ISectionRepository {
    public async create(data: ICreateSectionDTO) {
        const section = await database.section.create({
            data: {
                board_id: data.boardId,
                title: data.title,
                position: await this.countBoardSections(data.boardId),
            },
            include: {
                tasks: true,
            },
        });

        return section;
    }

    private async countBoardSections(boardId: string) {
        const quantity = await database.section.count({
            where: {
                board_id: boardId,
            },
        });
        return Number(quantity);
    }

    public async update({ sectionId, title }: IUpdateSectionDTO) {
        const updatedSection = await database.section.update({
            where: {
                section_id: sectionId,
            },
            data: {
                title,
            },
            include: {
                board: {
                    include: {
                        user: true,
                    },
                },
            },
        });

        return updatedSection;
    }

    public async delete({ sectionId }: IDeleteSectionDTO) {
        await database.section.delete({
            where: {
                section_id: sectionId,
            },
        });
    }
}
