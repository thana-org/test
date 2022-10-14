import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'john' })
  username: string;

  @ApiProperty({ example: 'secret' })
  password: string;
}
