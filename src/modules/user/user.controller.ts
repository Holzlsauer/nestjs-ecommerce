import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UpdateUserDTO } from './dto/updateUser.dto';
import { CreateUserDTO } from './dto/createUser.dto';
import { ListUserDTO } from './dto/listUser.dto';
import { UserService } from './user.service';
import { PasswordHash } from 'src/resources/pipes/passwordHash.pipe';

@Controller('/users')
export class UserController {
  constructor(private userService: UserService) { }

  @Post()
  async createUser(
    @Body() { password, ...userData }: CreateUserDTO,
    @Body('password', PasswordHash) passwordHash: string
  ) {
    const user = await this.userService.createUser({
      ...userData,
      password: passwordHash
    });

    return {
      user: new ListUserDTO(user.id, user.name),
      message: 'User created',
    };
  }

  @Get()
  async listUsers() {
    const users = await this.userService.listUsers();

    return users;
  }

  @Put('/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() userData: UpdateUserDTO,
  ) {
    const user = await this.userService.updateUser(
      id,
      userData,
    );

    return {
      user: user,
      message: 'User updated',
    };
  }

  @Delete('/:id')
  async removeUser(@Param('id') id: string) {
    const user = await this.userService.removeUser(id);

    return {
      user: user,
      message: 'User removed',
    };
  }
}
