import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CatalogService {
  constructor(private prisma: PrismaService) {}

  tags() {
    return this.prisma.tag.findMany({ orderBy: { id: 'asc' } });
  }

  champions() {
    return this.prisma.champion.findMany({ orderBy: { id: 'asc' } });
  }
}
