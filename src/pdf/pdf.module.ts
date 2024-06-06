import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { ErrorHandlerService } from 'src/services/error-handler.service';

@Module({
  imports: [HttpModule],
  providers: [PdfService, ErrorHandlerService],
  exports: [PdfService],
})
export class PdfModule {}
