import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { PdfService } from 'src/pdf/pdf.service';
import { ErrorHandlerService } from 'src/services/error-handler.service';

@Injectable()
export class MoviesService {
  private MOVIE_API_BASE_URL: string;
  private IMAGE_BASE_URL: string;
  private headers: { [key: string]: string };

  constructor(
    private readonly pdfSrvice: PdfService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly errorHandlerService: ErrorHandlerService,
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
        ({ id, title, release_date, vote_average }) => ({
          title,
          release_date,
          vote_average,
          link: `${this.MOVIE_API_BASE_URL}/3/movie/${id}`,
        }),
      );

      return this.pdfSrvice.createPdfStreamForAllMovies(modifiedData);
    } catch (error) {
      this.errorHandlerService.handleError(
        MoviesService.name,
        `Error occured during fetching all movies`,
        error,
        HttpStatus.BAD_REQUEST,
      );
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
      this.errorHandlerService.handleError(
        MoviesService.name,
        `Error occured during fetching movie by id`,
        error,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
