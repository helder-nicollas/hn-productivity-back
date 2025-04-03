/* eslint-disable no-unused-vars */
import { User } from '@prisma/client';
import { ICreateUserDTO } from '../user/dtos/ICreateUserDTO';

export interface IUserRepository {
    create(data: ICreateUserDTO): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    update(data: IUpdateUserDTO): Promise<User>;
}
