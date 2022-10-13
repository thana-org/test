import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './common/middlewares/auth.middleware';
import { UserModule } from './user/user.module';
import { ContentModule } from './content/content.module';

@Module({
  imports: [AuthModule, UserModule, ContentModule],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
