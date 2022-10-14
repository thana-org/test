import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiTags,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiExcludeEndpoint,
} from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';
import { ErrorDto } from 'src/common/dto/error.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiCreatedResponse({ type: UserDto, description: 'Created' })
  @ApiBadRequestResponse({ type: ErrorDto, description: 'Bad Request' })
  @ApiConflictResponse({
    type: ErrorDto,
    description: 'Username already exists',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get(':username')
  @ApiOkResponse({ type: UserDto, description: 'OK' })
  @ApiBadRequestResponse({ type: ErrorDto, description: 'Bad Request' })
  @ApiNotFoundResponse({ type: ErrorDto, description: 'Not found' })
  findOne(@Param('username') username: string) {
    return this.userService.findOne(username);
  }

  @Post('reset')
  @ApiExcludeEndpoint()
  reset() {
    return this.userService.reset();
  }
}
