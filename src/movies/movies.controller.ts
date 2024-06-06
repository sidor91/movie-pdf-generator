import { Controller, Get, Param, Res } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { Response } from 'express';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  async getAllMovies(@Res() res: Response) {
    const stream = await this.moviesService.getAllMovies();
    stream.pipe(res);
  }

  @Get(':id')
  async getMovieById(@Res() res: Response, @Param('id') id: string) {
    const stream = await this.moviesService.getMovieById(id);
    stream.pipe(res);
  }
}
