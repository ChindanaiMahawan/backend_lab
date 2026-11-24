import { Module } from '@nestjs/common';
import { ConverterService } from './converter.service.js';
import { ConverterController } from './converter.controller.js';

@Module({
  //ผูกคู่กัน
  controllers: [ConverterController],
  providers: [ConverterService], 
})
export class ConverterModule {}
