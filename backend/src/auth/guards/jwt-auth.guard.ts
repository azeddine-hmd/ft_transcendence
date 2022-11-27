import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

class JwtAuthGuard extends AuthGuard('jwt') {}

class LimitedJwtAuthGuard extends AuthGuard('jwt') {}

export const JwtAuth = UseGuards(JwtAuthGuard);

export const LimitedJwtAuth = UseGuards(LimitedJwtAuthGuard);
