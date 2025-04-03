/* eslint-disable no-unused-vars */
import { Board } from '@prisma/client';
import { ICreateBoardDTO } from '../board/dtos/ICreateBoardDTO';
import { IDeleteBoardDTO } from '../board/dtos/IDeleteBoardDTO';
import { IFindAllDTO } from '../board/dtos/IFindAllDTO';
import { IFindFavoritesDTO } from '../board/dtos/IFindFavoritesDTO';
import { IFindOneDTO } from '../board/dtos/IFindOneDTO';
import { IUpdateBoardDTO } from '../board/dtos/IUpdateBoardDTO';
import { IUpdateBoardsPositionsDTO } from '../board/dtos/IUpdateBoardsPositionsDTO';

export interface IBoardRepostiory {
    create(data: ICreateBoardDTO): Promise<Board>;
    update(data: IUpdateBoardDTO): Promise<void>;
    findAll(data: IFindAllDTO): Promise<Board[]>;
    updateBoardsPositions(data: IUpdateBoardsPositionsDTO): Promise<void>;
    findOne(data: IFindOneDTO): Promise<Board>;
    delete(data: IDeleteBoardDTO): Promise<void>;
    findFavorites(data: IFindFavoritesDTO): Promise<Board[]>;
    updateFavoritesBoardsPositions({
        boards,
    }: {
        boards: Board[];
    }): Promise<void>;
}
