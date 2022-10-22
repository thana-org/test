import { ApiProperty } from '@nestjs/swagger';

export class CreateContentDto {
  @ApiProperty({ example: 'https://www.youtube.com/watch?v=IkxhsTwNybU' })
  videoUrl: string;

  @ApiProperty({ example: 'แนะนำเลยครับ' })
  comment: string;

  @ApiProperty({ example: 5.0, maximum: 5.0, minimum: 0.0 })
  rating: number;
}
