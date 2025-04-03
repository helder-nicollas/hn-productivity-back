import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { BadRequestError } from '../helpers/api-errors';
import { IUserRepository } from '../repositories/types/user';

export class UserController {
    constructor(private repository: IUserRepository) {
        this.repository = repository;
    }

    public async register(req: Request, res: Response) {
        const { name, email, password } = req.body;

        const encrypted = await bcrypt.hash(password, 10);

        await this.repository.create({ name, email, password: encrypted });
        res.status(200).json({ message: 'User succesfully created!' });
    }

    public async login(req: Request, res: Response) {
        const { email, password } = req.body;

        const user = await this.repository.findByEmail(email);

        if (!user) throw new BadRequestError('Incorrect Email or Password!');

        const isCorrectPassword = await bcrypt.compare(password, user.password);

        if (!isCorrectPassword)
            throw new BadRequestError('Incorrect Email or Password!');

        const token = jwt.sign(
            { id: user.user_id },
            process.env.TOKEN_SECRET_KEY!,
            { expiresIn: '24h' },
        );

        res.status(200).json({ user, token });
    }

    public async recoverUserInformations(req: Request, res: Response) {
        const user = req.user;
        res.status(200).json(user);
    }

    public async update(req: Request, res: Response) {
        const { name, email, password } = req.body;
        const userId = req.user!.user_id;

        const encrypted = await bcrypt.hash(password, 10);

        const user = await this.repository.update({
            userId,
            name,
            email,
            password: encrypted,
        });

        res.status(200).json(user);
    }
}
