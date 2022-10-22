import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { ContentService } from 'src/content/content.service';
import users from './data/users';
import { videosUrl } from './data/contents';
import { CreateContentDto } from 'src/content/dto/create-content.dto';

@Injectable()
export class SeederService {
  constructor(
    private readonly userService: UserService,
    private readonly contentService: ContentService,
  ) {}

  async seed() {
    for (const user of users) {
      await this.userService.create(user);
    }
    for (const videoUrl of videosUrl) {
      const content = new CreateContentDto();
      content.videoUrl = videoUrl;
      content.rating = 5;
      content.comment = 'แนะนำเลยครับ';

      const username = ['john', 'jane', 'jan'][Math.floor(Math.random() * 3)];

      await this.contentService.create(content, username);
    }
  }
}
