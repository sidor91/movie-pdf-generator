import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { lastValueFrom } from 'rxjs';
import { AllMoviesResultType, MovieByIdResultType } from 'src/movies/types';
import { PassThrough } from 'stream';

@Injectable()
export class PdfService {
  private logger = new Logger(PdfService.name);
  constructor(private readonly httpService: HttpService) {}
  getDoc() {
    return new PDFDocument();
  }

  getStream() {
    return new PassThrough();
  }

  async getImageBuffer(path: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.get(path, {
          responseType: 'arraybuffer',
        }),
      );
      return Buffer.from(response.data, 'binary');
    } catch (error) {
      const errorMessage = 'Error occured during fetching image';
      this.logger.error(errorMessage);
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }
  }

  createPdfStreamForAllMovies(data: AllMoviesResultType[]): PassThrough {
    const doc = this.getDoc();
    const stream = this.getStream();

    doc.pipe(stream);

    data.forEach(({ link, title, release_date, vote_average }) => {
      doc
        .fontSize(12)
        .text(title, {
          underline: true,
          link,
        })
        .text(`Release Date: ${release_date}`)
        .text(`Vote Average: ${vote_average}`)
        .moveDown();
    });

    doc.end();

    return stream;
  }

  async createPdfStreamForMovieById(data: MovieByIdResultType) {
    const { title, release_date, vote_average, poster_path } = data;
    const doc = this.getDoc();
    const stream = this.getStream();
    const imageBuffer = await this.getImageBuffer(poster_path);

    doc.pipe(stream);

    doc
      .fontSize(12)
      .text(title)
      .text(`Release Date: ${release_date}`)
      .text(`Vote Average: ${vote_average}`)
      .image(imageBuffer, {
        fit: [250, 300],
      })
      .moveDown();

    doc.end();

    return stream;
  }
}
