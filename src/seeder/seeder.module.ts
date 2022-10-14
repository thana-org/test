import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { SeederController } from './seeder.controller';
import { ContentModule } from 'src/content/content.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule, ContentModule],
  controllers: [SeederController],
  providers: [SeederService],
})
export class SeederModule {}
