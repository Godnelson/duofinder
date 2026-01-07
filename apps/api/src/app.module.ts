import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { DiscoverModule } from './discover/discover.module';
import { SwipesModule } from './swipes/swipes.module';
import { MatchesModule } from './matches/matches.module';
import { CatalogModule } from './catalog/catalog.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ProfileModule,
    DiscoverModule,
    SwipesModule,
    MatchesModule,
    CatalogModule,
  ],
})
export class AppModule {}
