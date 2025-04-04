import { Router } from 'express';

import { BoardRepository } from '../repositories/board';
import { BoardController } from '../controllers/board-controller';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

const boardRepository = new BoardRepository();
const boardController = new BoardController(boardRepository);

router.post('/', authMiddleware(), (req, res) =>
    boardController.create(req, res),
);
router.get('/', authMiddleware(), (req, res) =>
    boardController.getAll(req, res),
);
router.put('/', authMiddleware(), (req, res) =>
    boardController.updateBoardsPositions(req, res),
);
router.get('/favorites', authMiddleware(), (req, res) =>
    boardController.getFavorites(req, res),
);
router.put('/favorites', authMiddleware(), (req, res) =>
    boardController.updateFavoritesBoardsPositions(req, res),
);

router.put('/:boardId', authMiddleware(), (req, res) =>
    boardController.update(req, res),
);
router.get('/:boardId', authMiddleware(), (req, res) =>
    boardController.getOne(req, res),
);
router.delete('/:boardId', authMiddleware(), (req, res) =>
    boardController.delete(req, res),
);

export default router;
