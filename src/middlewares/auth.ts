/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { UserRepository } from '../repositories/user';

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const userRepository = new UserRepository();
    const token = req.headers['authorization'];
    if (!token) {
        res.status(401).json({ message: 'Unauthorized: No token provided!' });
        return;
    }

    jwt.verify(token, process.env.TOKEN_SECRET_KEY!, (err, decoded: any) => {
        if (err) {
            res.status(401).json({
                message: 'Unauthorized: Invalid token!',
            });
            return;
        }

        userRepository.findById(decoded.id).then(user => {
            req.user = user;
            next();
        });
    });
};
