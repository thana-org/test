import { ApiProperty } from '@nestjs/swagger';
import { UserDTO } from 'src/user/dto/user.dto';

export class Content {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({
    example: 'ฉลามชอบงับคุณ - Bonnadol Feat IIVY B [Official MV]',
  })
  videoTitle: string;

  @ApiProperty({ example: 'https://www.youtube.com/watch?v=IkxhsTwNybU' })
  videoUrl: string;

  @ApiProperty({ example: 'แนะนำเลยครับ' })
  comment: string;

  @ApiProperty({ example: 5.0, maximum: 5.0, minimum: 0.0 })
  rating: number;

  @ApiProperty({ example: 'https://i.ytimg.com/vi/IkxhsTwNybU/hqdefault.jpg' })
  thumbnailUrl: string;

  @ApiProperty({ example: 'Bonnadol' })
  creatorName: string;

  @ApiProperty({ example: 'https://www.youtube.com/c/bonnadol' })
  creatorUrl: string;

  @ApiProperty({ type: UserDTO })
  postedBy: UserDTO;

  @ApiProperty({ example: '2022-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2022-01-01T00:00:00.000Z' })
  updatedAt: Date;
}
