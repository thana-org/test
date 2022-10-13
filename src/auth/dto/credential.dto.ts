import { ApiProperty } from '@nestjs/swagger';

export class CredentialDTO {
  @ApiProperty({ example: 'john' })
  accessToken: string;
}
