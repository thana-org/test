import { ApiProperty } from '@nestjs/swagger';

export class CredentialDTO {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmF...',
  })
  accessToken: string;
}
