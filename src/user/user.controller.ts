import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiTags,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { UserDTO } from './dto/user.dto';
import { ErrorDTO } from 'src/common/dto/error.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiCreatedResponse({ type: UserDTO, description: 'Created' })
  @ApiBadRequestResponse({ type: ErrorDTO, description: 'Bad Request' })
  @ApiConflictResponse({
    type: ErrorDTO,
    description: 'Username already exists',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get(':username')
  @ApiOkResponse({ type: UserDTO, description: 'OK' })
  @ApiBadRequestResponse({ type: ErrorDTO, description: 'Bad Request' })
  @ApiNotFoundResponse({ type: ErrorDTO, description: 'Not found' })
  findOne(@Param('username') username: string) {
    return this.userService.findOne(username);
  }
}
