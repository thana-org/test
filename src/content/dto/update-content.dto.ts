import { ApiProperty } from '@nestjs/swagger';

export class UpdateContentDto {
  videoUrl: string;

  @ApiProperty({ example: 'เยี่ยมครับ', required: false })
  comment: string;

  @ApiProperty({ example: 5.0, maximum: 5.0, minimum: 0.0, required: false })
  rating: number;
}
