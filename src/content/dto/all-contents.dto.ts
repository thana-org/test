import { ApiProperty } from '@nestjs/swagger';
import { Content } from '../entities/content.entity';

export class AllContentsDTO {
  @ApiProperty({ type: [Content] })
  contents: Content[];
}
