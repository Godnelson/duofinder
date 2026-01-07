import { Controller, Get } from '@nestjs/common';
import { CatalogService } from './catalog.service';

@Controller('catalog')
export class CatalogController {
  constructor(private catalog: CatalogService) {}

  @Get('tags')
  tags() {
    return this.catalog.tags();
  }

  @Get('champions')
  champions() {
    return this.catalog.champions();
  }
}
