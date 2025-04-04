import { Router } from 'express';
import { TaskController } from '../controllers/task-controller';
import { TaskRepository } from '../repositories/task';
import { authMiddleware } from '../middlewares/auth';
import { BoardRepository } from '../repositories/board';

const router = Router({ mergeParams: true });

const taskRepository = new TaskRepository();
const boardRepository = new BoardRepository();
const taskController = new TaskController(taskRepository, boardRepository);

router.post('/:sectionId/tasks', authMiddleware(), (req, res) =>
    taskController.create(req, res),
);
router.put('/tasks/updatePositions', authMiddleware(), (req, res) =>
    taskController.updateTasksPositions(req, res),
);
router.put('/:sectionId/tasks/:taskId', authMiddleware(), (req, res) =>
    taskController.update(req, res),
);
router.delete('/:sectionId/tasks/:taskId', authMiddleware(), (req, res) =>
    taskController.delete(req, res),
);

export default router;
