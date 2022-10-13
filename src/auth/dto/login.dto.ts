import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
  @ApiProperty({ example: 'john' })
  username: string;

  @ApiProperty({ example: 'secret' })
  password: string;
}
