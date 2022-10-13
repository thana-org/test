import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import axios from 'axios';
import { UserService } from 'src/user/user.service';
import { AllContentsDTO } from './dto/all-contents.dto';
import { CreateContentDto } from './dto/create-content.dto';
import { OEmbedResponseDTO } from './dto/oEmbed.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { Content } from './entities/content.entity';

@Injectable()
export class ContentService {
  constructor(private readonly userService: UserService) {}

  private contents: Content[] = [];

  async create(createContentDto: CreateContentDto, username: string) {
    const { videoUrl: rawVideoUrl, comment, rating } = createContentDto;

    if (!rawVideoUrl || !comment || typeof rating === 'undefined')
      throw new BadRequestException(
        '`videoUrl`, `comment`, and `rating` is required',
      );
    if (![0, 1, 2, 3, 4, 5].includes(rating))
      throw new BadRequestException(
        '`rating` must be an integer between 0 and 5',
      );

    const { videoTitle, videoUrl, thumbnailUrl, creatorName, creatorUrl } =
      await this.getVideoDetails(rawVideoUrl);
    const postedBy = this.userService.findOne(username);
    const createdAt = new Date();
    const contentId = this.generateContentId();

    const content = new Content();
    content.id = contentId;
    content.videoTitle = videoTitle;
    content.videoUrl = videoUrl;
    content.comment = comment;
    content.rating = rating;
    content.thumbnailUrl = thumbnailUrl;
    content.creatorName = creatorName;
    content.creatorUrl = creatorUrl;
    content.postedBy = postedBy;
    content.createdAt = createdAt;
    content.updatedAt = createdAt;

    this.contents.push(content);

    return content;
  }

  findAll() {
    const allContents = new AllContentsDTO();
    allContents.contents = this.contents;

    return allContents;
  }

  async findOne(id: number) {
    if (!id) throw new BadRequestException('`id` is required');

    const content = this.contents.find((content) => content.id === id);
    if (!content) throw new NotFoundException(`Content id ${id} not found`);
    return content;
  }

  update(id: number, updateContentDto: UpdateContentDto, username: string) {
    const content = this.contents.find((content) => content.id === id);
    if (!content) throw new NotFoundException(`Content id ${id} not found`);
    if (content.postedBy.username !== username)
      throw new ForbiddenException(
        `User ${username} is not the owner of this content`,
      );

    const { videoUrl, comment, rating } = updateContentDto;

    if (videoUrl) throw new BadRequestException('`videoUrl` cannot be updated');
    if (typeof rating !== 'undefined' && ![0, 1, 2, 3, 4, 5].includes(rating))
      throw new BadRequestException(
        '`rating` must be an integer between 0 and 5',
      );

    if (comment) content.comment = comment;
    if (rating) content.rating = rating;
    content.updatedAt = new Date();

    return content;
  }

  remove(id: number, username) {
    if (!id) throw new BadRequestException('`id` is required');

    const content = this.contents.find((content) => content.id === id);
    if (!content) throw new NotFoundException(`Content id ${id} not found`);
    if (content.postedBy.username !== username)
      throw new ForbiddenException(
        `User ${username} is not the owner of this content`,
      );

    this.contents = this.contents.filter((content) => content.id !== id);

    return content;
  }

  reset() {
    this.contents = [];
  }

  private generateContentId() {
    if (this.contents.length === 0) return 1;
    return this.contents[this.contents.length - 1].id + 1;
  }

  private async getVideoDetails(videoUrl: string) {
    try {
      const res = await axios.get<OEmbedResponseDTO>(
        `https://noembed.com/embed?url=${videoUrl}`,
      );

      const { title, url, thumbnail_url, author_name, author_url, error } =
        res.data;
      if (error) throw new BadRequestException('Invalid video link');

      return {
        videoTitle: title,
        videoUrl: url,
        thumbnailUrl:
          thumbnail_url ??
          'https://placehold.jp/38/fab005/ffffff/480x360.png?text=No+Preview+Available',
        creatorName: author_name ?? '',
        creatorUrl: author_url ?? '',
      };
    } catch (err) {
      if (err instanceof BadRequestException) throw err;
      throw new ServiceUnavailableException(
        'Content API service is unavailable',
      );
    }
  }
}
