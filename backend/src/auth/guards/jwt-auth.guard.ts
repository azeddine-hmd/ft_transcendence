import { Injectable, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
class JwtAuthGuard extends AuthGuard('jwt') {}

export const JwtAuth = UseGuards(JwtAuthGuard);
