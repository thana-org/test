import { ApiProperty } from '@nestjs/swagger';
import { Content } from '../entities/content.entity';

export class ContentsDto {
  @ApiProperty({ type: [Content] })
  contents: Content[];
}
