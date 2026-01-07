import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async register(email: string, password: string) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('Email já existe');

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({ data: { email, passwordHash } });

    // perfil inicial (o usuário pode editar depois)
    await this.prisma.profile.create({
      data: {
        userId: user.id,
        server: 'BR',
        rankTier: 'UNRANKED',
        rankDivision: null,
        lp: 0,
        primaryRole: 'MID',
        secondaryRole: null,
        nickname: 'PREENCHA_NO_PERFIL',
        isMono: false,
      },
    });

    return this.sign(user.id, user.email);
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Credenciais inválidas');

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new UnauthorizedException('Credenciais inválidas');

    return this.sign(user.id, user.email);
  }

  private sign(userId: string, email: string) {
    const accessToken = this.jwt.sign({ sub: userId, email });
    return { accessToken };
  }
}
