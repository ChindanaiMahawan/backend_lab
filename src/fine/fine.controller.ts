import { Controller, Get, Query } from '@nestjs/common';
import { FineService } from './fine.service.js';

@Controller('fine')
export class FineController {
  constructor(private readonly fineService: FineService) {}

  @Get()
  convert(@Query('days') days?: string, @Query('type') type?: string) {
    return this.fineService.convert(days, type);
  }
}