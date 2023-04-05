import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiSecurity,
  ApiServiceUnavailableResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { ErrorDto } from 'src/common/dto/error.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ContentService } from './content.service';
import { ContentDto } from './dto/content.dto';
import { ContentsDto } from './dto/contents.dto';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@ApiTags('content')
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get()
  @ApiOkResponse({ type: ContentsDto, description: 'OK' })
  findAll() {
    return this.contentService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: ContentDto, description: 'OK' })
  @ApiNotFoundResponse({ type: ErrorDto, description: 'Not found' })
  findOne(@Param('id') id: string) {
    return this.contentService.findOne(+id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiSecurity('bearer')
  @ApiCreatedResponse({ type: ContentDto, description: 'Created' })
  @ApiBadRequestResponse({ type: ErrorDto, description: 'Bad Request' })
  @ApiUnauthorizedResponse({ type: ErrorDto, description: 'Unauthorized' })
  @ApiServiceUnavailableResponse({
    type: ErrorDto,
    description: 'Service unavailable',
  })
  create(@Body() createContentDto: CreateContentDto, @Req() req: Request) {
    return this.contentService.create(createContentDto, req.username);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiSecurity('bearer')
  @ApiOkResponse({ type: ContentDto, description: 'OK' })
  @ApiBadRequestResponse({ type: ErrorDto, description: 'Bad Request' })
  @ApiUnauthorizedResponse({ type: ErrorDto, description: 'Unauthorized' })
  @ApiForbiddenResponse({ type: ErrorDto, description: 'Forbidden' })
  @ApiNotFoundResponse({ type: ErrorDto, description: 'Not found' })
  update(
    @Param('id') id: string,
    @Body() updateContentDto: UpdateContentDto,
    @Req() req: Request,
  ) {
    return this.contentService.update(+id, updateContentDto, req.username);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiSecurity('bearer')
  @ApiOkResponse({ type: ContentDto, description: 'OK' })
  @ApiBadRequestResponse({ type: ErrorDto, description: 'Bad Request' })
  @ApiUnauthorizedResponse({ type: ErrorDto, description: 'Unauthorized' })
  @ApiForbiddenResponse({ type: ErrorDto, description: 'Forbidden' })
  @ApiNotFoundResponse({ type: ErrorDto, description: 'Not found' })
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.contentService.remove(+id, req.username);
  }
}
