import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { PdfService } from 'src/pdf/pdf.service';

@Injectable()
export class MoviesService {
  private logger = new Logger(MoviesService.name);
  private MOVIE_API_BASE_URL: string;
  private IMAGE_BASE_URL: string;
  private headers: { [key: string]: string };

  constructor(
    private readonly pdfSrvice: PdfService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.MOVIE_API_BASE_URL = this.configService.get('MOVIE_API_BASE_URL');
    this.IMAGE_BASE_URL = this.configService.get('IMAGE_BASE_URL');
    const ACCESS_TOKEN = this.configService.get('MOVIE_API_ACCESS_TOKEN');
    this.headers = {
      accept: 'application/json',
      Authorization: `Bearer ${ACCESS_TOKEN}`,
    };
  }

  async getAllMovies() {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.MOVIE_API_BASE_URL}/3/movie/popular`, {
          headers: this.headers,
        }),
      );
      const results = response.data.results;
      const modifiedData = results.map(
        ({ id, original_title, release_date, vote_average }) => ({
          original_title,
          release_date,
          vote_average,
          link: `${this.MOVIE_API_BASE_URL}/3/movie/${id}`,
        }),
      );

      return this.pdfSrvice.createPdfStreamForAllMovies(modifiedData);
    } catch (error) {
      const message = 'Error occured during fetching all movies';
      this.logger.error(message, error);
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }

  async getMovieById(id: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.get(`${this.MOVIE_API_BASE_URL}/3/movie/${id}`, {
          headers: this.headers,
        }),
      );
      const { title, release_date, vote_average, poster_path } = response.data;
      return this.pdfSrvice.createPdfStreamForMovieById({
        title,
        release_date,
        vote_average,
        poster_path: `${this.IMAGE_BASE_URL}${poster_path}`,
      });
    } catch (error) {
      const message = 'Error occured during fetching movie by id';
      this.logger.error(message, error);
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }
  }
}
