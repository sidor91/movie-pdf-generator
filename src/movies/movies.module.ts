import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { HttpModule } from '@nestjs/axios';
import { PdfModule } from 'src/pdf/pdf.module';

@Module({
  imports: [HttpModule, PdfModule],
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
