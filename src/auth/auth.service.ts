import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { UserService } from '../user/user.service';
import { CredentialDto } from './dto/credential.dto';
import { JWTTokenPayload } from './dto/jwt-token.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async login(loginDto: LoginDto) {
    const { username: rawUsername, password } = loginDto;

    if (!rawUsername || !password)
      throw new BadRequestException('`username` and `password` is required');

    const username = rawUsername.toLowerCase();

    const user = await this.userService.findOne(username);
    if (!user)
      throw new UnauthorizedException('Username or password is invalid');

    const passwordValid = await compare(password, user.password);
    if (!passwordValid)
      throw new UnauthorizedException('Username or password is invalid');

    const credential = new CredentialDto();
    credential.accessToken = this.generateToken(username);

    return credential;
  }

  generateToken(username: string) {
    return this.jwtService.sign({ username });
  }

  validateToken(token: string) {
    let payload: JWTTokenPayload;
    try {
      payload = this.jwtService.verify<JWTTokenPayload>(token);
    } catch (err) {
      throw new UnauthorizedException('Bearer token is invalid');
    }
    return payload.username;
  }
}
