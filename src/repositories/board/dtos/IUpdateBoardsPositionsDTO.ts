import { Board } from '@prisma/client';

export interface IUpdateBoardsPositionsDTO {
    boards: Board[];
}
