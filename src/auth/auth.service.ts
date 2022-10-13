import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { UserService } from '../user/user.service';
import { CredentialDTO } from './dto/credential.dto';
import { JWTTokenPayload } from './dto/jwt-token.dto';
import { LoginDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async login(loginDTO: LoginDTO) {
    const { username: rawUsername, password } = loginDTO;

    if (!rawUsername || !password)
      throw new BadRequestException('`username` and `password` is required');

    const username = rawUsername.toLowerCase();

    const user = this.userService.findOneWithPassword(username);
    if (!user)
      throw new UnauthorizedException('Username or password is invalid');

    const passwordValid = await compare(password, user.password);
    if (!passwordValid)
      throw new UnauthorizedException('Username or password is invalid');

    const credential = new CredentialDTO();
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
