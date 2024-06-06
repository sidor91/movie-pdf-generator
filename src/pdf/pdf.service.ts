import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable } from '@nestjs/common';
import * as PDFDocument from 'pdfkit';
import { lastValueFrom } from 'rxjs';
import { AllMoviesResultType, MovieByIdResultType } from 'src/movies/types';
import { ErrorHandlerService } from 'src/services/error-handler.service';
import { PassThrough } from 'stream';

@Injectable()
export class PdfService {
  constructor(
    private readonly httpService: HttpService,
    private readonly errorHandlerService: ErrorHandlerService,
  ) {}
  private getDoc() {
    return new PDFDocument();
  }

  private getStream() {
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
      this.errorHandlerService.handleError(
        PdfService.name,
        `Error occured during fetching image`,
        error,
        HttpStatus.NOT_FOUND,
      );
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
