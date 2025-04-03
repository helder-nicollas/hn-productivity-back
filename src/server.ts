/* eslint-disable @typescript-eslint/no-namespace */
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

import { errorMiddleware } from './middlewares/error';
import usersRouter from './routes/users';
import boardsRouter from './routes/boards';
import sectionsRouter from './routes/sections';
import tasksRouter from './routes/tasks';
import './database';
import { User } from '@prisma/client';

const app = express();

//General Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//Routes

app.use('/users', usersRouter);
app.use('/boards', boardsRouter);
app.use('/boards/:boardId/sections', sectionsRouter, tasksRouter);

//Error Middleware
app.use(errorMiddleware);

declare global {
    namespace Express {
        interface Request {
            user?: User | null;
        }
    }
}

const PORT = process.env.SERVER_PORT;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
