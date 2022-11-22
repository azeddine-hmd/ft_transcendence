import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

class JwtAuthGuard extends AuthGuard('jwt') {}

export const JwtAuth = UseGuards(JwtAuthGuard);
