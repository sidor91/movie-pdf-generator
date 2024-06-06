import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MoviesModule } from './movies/movies.module';
import { AppConfigModule } from './config/app-config.module';
import { PdfModule } from './pdf/pdf.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [MoviesModule, AppConfigModule, PdfModule, HttpModule],
  controllers: [AppController],
})
export class AppModule {}
