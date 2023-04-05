import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({ example: 'b9e1a5c5-ff16-4e50-8bb3-cb76d8900f70' })
  id: number;

  @ApiProperty({ example: 'john' })
  username: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: '2022-01-01T00:00:00.000Z' })
  registeredAt: Date;
}
