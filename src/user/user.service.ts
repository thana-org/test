import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { hash } from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private users: User[] = [];

  async create(createUserDto: CreateUserDto) {
    const { username: rawUsername, name, password } = createUserDto;

    if (!rawUsername || !name || !password)
      throw new BadRequestException(
        '`username`, `name`, and `password` is required',
      );

    const username = rawUsername.toLowerCase();

    const duplicateUsername = this.users.some(
      (user) => user.username === username,
    );
    if (duplicateUsername)
      throw new ConflictException(`Username ${username} already exists`);

    const user = new User();
    user.username = username;
    user.name = name;
    user.password = await hash(password, 10);
    user.registeredAt = new Date();

    this.users.push(user);

    return this.findOne(username);
  }

  findOne(username: string) {
    if (!username) throw new BadRequestException('`username` is required');
    username = username.toLowerCase();

    const user = this.users.find((user) => user.username === username);
    if (!user) throw new NotFoundException(`User ${username} not found`);

    const userDto = new UserDto();
    userDto.username = user.username;
    userDto.name = user.name;
    userDto.registeredAt = user.registeredAt;

    return userDto;
  }

  findOneWithPassword(username: string) {
    username = username.toLowerCase();
    return this.users.find((user) => user.username === username);
  }

  reset() {
    this.users = [];
  }
}
