import { IUserRepository } from '../types/user';
import { ICreateUserDTO } from './dtos/ICreateUserDTO';
import { database } from '../../database';

export class UserRepository implements IUserRepository {
    public async create({ name, email, password }: ICreateUserDTO) {
        const user = await database.user.create({
            data: {
                name,
                email,
                password,
            },
        });
        return user;
    }

    public async findByEmail(email: string) {
        const searchedUser = await database.user.findUnique({
            where: { email },
        });
        return searchedUser;
    }

    public async findById(id: string) {
        const user = await database.user.findUnique({
            where: {
                user_id: id,
            },
        });
        return user;
    }

    public async update({ userId, email, name, password }: IUpdateUserDTO) {
        const updatedUser = await database.user.update({
            where: {
                user_id: userId,
            },
            data: {
                password,
                name,
                email,
            },
        });
        return updatedUser;
    }
}
