import { IBoardRepostiory } from '../types/board';
import { IFindOneDTO } from './dtos/IFindOneDTO';
import { ICreateBoardDTO } from './dtos/ICreateBoardDTO';
import { IUpdateBoardsPositionsDTO } from './dtos/IUpdateBoardsPositionsDTO';
import { IFindAllDTO } from './dtos/IFindAllDTO';
import { IDeleteBoardDTO } from './dtos/IDeleteBoardDTO';
import { IUpdateBoardDTO } from './dtos/IUpdateBoardDTO';
import { IFindFavoritesDTO } from './dtos/IFindFavoritesDTO';
import { database } from '../../database';
import { Board } from '@prisma/client';

export class BoardRepository implements IBoardRepostiory {
    public async create(data: ICreateBoardDTO) {
        const boardsQuantity = await this.countBoards(data.userId);
        const position = boardsQuantity > 0 ? boardsQuantity : 0;

        const board = await database.board.create({
            data: {
                favorite: false,
                favorite_position: 0,
                description: 'Board',
                icon: '',
                user_id: data.userId,
                position,
                title: 'Board',
            },
        });

        return board;
    }

    public async findAll(data: IFindAllDTO) {
        const boards = await database.board.findMany({
            where: {
                user_id: data.userId,
            },
            orderBy: {
                position: 'asc',
            },
        });

        return boards;
    }

    private async countBoards(userId: string) {
        return await database.board.count({
            where: {
                user_id: userId,
            },
        });
    }

    public async findOne(data: IFindOneDTO) {
        const searchedBoard = await database.board.findUnique({
            where: {
                user_id: data.userId,
                board_id: data.boardId,
            },
            include: {
                sections: {
                    include: {
                        tasks: true,
                    },
                    orderBy: {
                        position: 'asc',
                    },
                },
            },
        });

        return searchedBoard!;
    }

    public async updateBoardsPositions(data: IUpdateBoardsPositionsDTO) {
        for (const index in data.boards) {
            await database.board.update({
                data: {
                    position: Number(index),
                },
                where: { board_id: data.boards[index].board_id },
            });
        }
    }

    public async delete(data: IDeleteBoardDTO) {
        await database.board.delete({
            where: {
                user_id: data.userId,
                board_id: data.boardId,
            },
        });
    }

    public async update(data: IUpdateBoardDTO) {
        database.$transaction(async context => {
            const boardToUpdate = await context.board.findUnique({
                where: {
                    user_id: data.userId,
                    board_id: data.boardId,
                },
            });

            let favoritePosition = 0;

            if (data.favorite != boardToUpdate?.favorite) {
                const favoritesBoards =
                    await this.findFavoritesWithoutSearchedBoard(
                        data.boardId,
                        data.userId,
                    );

                if (data.favorite) {
                    favoritePosition =
                        favoritesBoards.length > 0 ? favoritesBoards.length : 0;
                } else {
                    await this.updateFavoritesBoardsPositions({
                        boards: favoritesBoards,
                    });
                }
            }

            await context.board.update({
                where: {
                    board_id: data.boardId,
                    user_id: data.userId,
                },
                data: {
                    description: data.description,
                    favorite_position: favoritePosition,
                    favorite: data.favorite,
                    icon: data.icon,
                    title: data.title,
                },
            });
        });
    }

    public async findFavorites(data: IFindFavoritesDTO) {
        const favoritesBoards = await database.board.findMany({
            where: {
                user_id: data.userId,
                favorite: true,
            },
            orderBy: {
                favorite_position: 'asc',
            },
        });
        return favoritesBoards;
    }

    private async findFavoritesWithoutSearchedBoard(
        boardId: string,
        userId: string,
    ) {
        const favoritesBoards = await database.board.findMany({
            where: {
                user_id: userId,
                favorite: true,
                board_id: {
                    not: boardId,
                },
            },
            orderBy: {
                favorite_position: 'asc',
            },
        });

        return favoritesBoards;
    }

    public async updateFavoritesBoardsPositions({
        boards,
    }: {
        boards: Board[];
    }) {
        database.$transaction(async context => {
            for (const index in boards) {
                await context.board.update({
                    where: { board_id: boards[index].board_id },
                    data: {
                        favorite_position: Number(index),
                    },
                });
            }
        });
    }
}
