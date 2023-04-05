import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcryptjs';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { username: rawUsername, name, password } = createUserDto;

    if (!rawUsername || !name || !password)
      throw new BadRequestException(
        '`username`, `name`, and `password` is required',
      );

    const username = rawUsername.toLowerCase();

    const duplicateUser = await this.findOne(username);
    if (duplicateUser)
      throw new ConflictException(`Username ${username} already exists`);

    const user = new User();
    user.username = username;
    user.name = name;
    user.password = await hash(password, 10);
    user.registeredAt = new Date();

    await this.userRepository.save(user);

    return this.findOnePublicInfo(username);
  }

  findOne(username: string): Promise<User> {
    return this.userRepository.findOneBy({ username });
  }

  async findOnePublicInfo(username: string): Promise<UserDto> {
    if (!username) throw new BadRequestException('`username` is required');

    const user = await this.userRepository.findOneBy({ username });
    if (!user) throw new NotFoundException(`User ${username} not found`);

    const userDto = new UserDto();
    userDto.id = user.id;
    userDto.username = user.username;
    userDto.name = user.name;
    userDto.registeredAt = user.registeredAt;

    return userDto;
  }
}
