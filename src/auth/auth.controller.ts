import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { ErrorDto } from 'src/common/dto/error.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UserDto } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { CredentialDto } from './dto/credential.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  @HttpCode(200)
  @ApiOkResponse({ type: CredentialDto, description: 'OK' })
  @ApiBadRequestResponse({ type: ErrorDto, description: 'Bad Request' })
  @ApiUnauthorizedResponse({ type: ErrorDto, description: 'Unauthorized' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiSecurity('bearer')
  @ApiOkResponse({ type: UserDto, description: 'OK' })
  @ApiUnauthorizedResponse({ type: ErrorDto, description: 'Unauthorized' })
  me(@Req() req: Request) {
    return this.userService.findOne(req.username);
  }
}
