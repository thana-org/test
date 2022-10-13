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
import { ErrorDTO } from 'src/common/dto/error.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UserDTO } from 'src/user/dto/user.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { CredentialDTO } from './dto/credential.dto';
import { LoginDTO } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  @HttpCode(200)
  @ApiOkResponse({ type: CredentialDTO, description: 'OK' })
  @ApiBadRequestResponse({ type: ErrorDTO, description: 'Bad Request' })
  @ApiUnauthorizedResponse({ type: ErrorDTO, description: 'Unauthorized' })
  async login(@Body() loginDto: LoginDTO) {
    return this.authService.login(loginDto);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  @ApiSecurity('bearer')
  @ApiOkResponse({
    description: 'OK',
    type: UserDTO,
  })
  @ApiOkResponse({ type: UserDTO, description: 'OK' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  me(@Req() req: Request) {
    return this.userService.findOne(req.username);
  }
}
