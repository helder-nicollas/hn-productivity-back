import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../helpers/jwt';
import { redis } from '../database';

export function authMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            res.status(401).json({
                message: 'Unauthorized: No token provided!',
            });
            return;
        }

        const userId = verifyToken(token);

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized: Invalid token!' });
            return;
        }

        const user = await redis.get(`user-${userId}`);
        req.user = JSON.parse(user!);

        next();
    };
}
