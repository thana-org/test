import { Controller, Post, HttpCode } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { SeederService } from './seeder.service';

@Controller('seeder')
@ApiExcludeController()
export class SeederController {
  constructor(private readonly seederService: SeederService) {}

  @Post()
  @HttpCode(200)
  seed() {
    return this.seederService.seed();
  }
}
