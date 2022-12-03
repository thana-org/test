import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { ContentsDto } from './dto/contents.dto';
import { CreateContentDto } from './dto/create-content.dto';
import { OEmbedResponseDto } from './dto/o-embed.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { Content } from './entities/content.entity';

@Injectable()
export class ContentService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(Content) private contentRepository: Repository<Content>,
  ) {}

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
    if (comment.length > 280)
      throw new BadRequestException(
        '`comment` must be less than or equal to 280 characters',
      );

    const { videoTitle, videoUrl, thumbnailUrl, creatorName, creatorUrl } =
      await this.getVideoDetails(rawVideoUrl);
    const postedBy = await this.userService.findOne(username);
    const createdAt = new Date();

    const content = new Content();
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

    await this.contentRepository.save(content);

    return this.findOne(content.id);
  }

  async findAll(): Promise<ContentsDto> {
    const contents = await this.contentRepository.find();

    contents.forEach((content) => {
      delete content.postedBy.password;
    });

    const contentsDto = new ContentsDto();
    contentsDto.data = contents;

    return contentsDto;
  }

  async findOne(id: number) {
    if (!id) throw new BadRequestException('`id` is required');

    const content = await this.contentRepository.findOneBy({ id });
    if (!content) throw new NotFoundException(`Content id ${id} not found`);

    delete content.postedBy.password;
    return content;
  }

  async update(
    id: number,
    updateContentDto: UpdateContentDto,
    username: string,
  ) {
    const content = await this.contentRepository.findOneBy({ id });
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
    if (comment.length > 280)
      throw new BadRequestException(
        '`comment` must be less than or equal to 280 characters',
      );

    if (comment) content.comment = comment;
    if (rating) content.rating = rating;
    content.updatedAt = new Date();

    await this.contentRepository.save(content);

    delete content.postedBy.password;
    return content;
  }

  async remove(id: number, username) {
    if (!id) throw new BadRequestException('`id` is required');

    const content = await this.contentRepository.findOneBy({ id });
    if (!content) throw new NotFoundException(`Content id ${id} not found`);
    if (content.postedBy.username !== username)
      throw new ForbiddenException(
        `User ${username} is not the owner of this content`,
      );

    await this.contentRepository.delete({ id });

    delete content.postedBy.password;
    return content;
  }

  private async getVideoDetails(videoUrl: string) {
    try {
      const res = await axios.get<OEmbedResponseDto>(
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
