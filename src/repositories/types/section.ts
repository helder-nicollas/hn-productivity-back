/* eslint-disable no-unused-vars */
import { Section } from '@prisma/client';
import { ICreateSectionDTO } from '../section/dtos/ICreateSectionDTO';
import { IDeleteSectionDTO } from '../section/dtos/IDeleteSectionDTO';
import { IUpdateSectionDTO } from '../section/dtos/IUpdateSectionDTO';

export interface ISectionRepository {
    create(data: ICreateSectionDTO): Promise<Section>;
    update(data: IUpdateSectionDTO): Promise<Section>;
    delete(data: IDeleteSectionDTO): Promise<void>;
}
