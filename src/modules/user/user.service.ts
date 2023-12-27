import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ListUserDTO } from './dto/listUser.dto';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDTO } from './dto/updateUser.dto';
import { CreateUserDTO } from './dto/createUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) { }

  async createUser(userData: CreateUserDTO) {
    const user = new UserEntity();

    Object.assign(user, userData as UserEntity);

    return this.userRepository.save(user);
  }

  async listUsers() {
    const users = await this.userRepository.find();
    const usersList = users.map(
      (user) => new ListUserDTO(user.id, user.name),
    );
    return usersList;
  }

  async findByEmail(email: string) {
    const checkEmail = await this.userRepository.findOne({
      where: { email },
    });

    if (checkEmail === null)
      throw new NotFoundException('Email not found');

    return checkEmail;
  }

  async updateUser(id: string, userData: UpdateUserDTO) {
    const user = await this.userRepository.findOneBy({ id });

    if (user === null)
      throw new NotFoundException('User not found');

    Object.assign(user, userData as UserEntity);

    return this.userRepository.save(user);
  }

  async removeUser(id: string) {
    const user = await this.userRepository.delete(id);

    if (!user.affected)
      throw new NotFoundException('User not found');
  }
}
