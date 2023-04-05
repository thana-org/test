import { ApiProperty } from '@nestjs/swagger';
import { ContentDto } from './content.dto';

export class ContentsDto {
  @ApiProperty({ type: [ContentDto] })
  data: ContentDto[];
}
