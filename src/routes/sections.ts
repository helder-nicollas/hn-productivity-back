import { Router } from 'express';

import { SectionController } from '../controllers/section-controller';
import { SectionRepository } from '../repositories/section';
import { authMiddleware } from '../middlewares/auth';
import { BoardRepository } from '../repositories/board';

const router = Router({ mergeParams: true });

const sectionRepository = new SectionRepository();
const boardRepository = new BoardRepository();
const sectionController = new SectionController(
    sectionRepository,
    boardRepository,
);

router.post('/', authMiddleware, (req, res) =>
    sectionController.create(req, res),
);
router.put('/:sectionId', authMiddleware, (req, res) =>
    sectionController.update(req, res),
);
router.delete('/:sectionId', authMiddleware, (req, res) =>
    sectionController.delete(req, res),
);

export default router;
