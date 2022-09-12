import { Injectable, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
class JwtAuthGuardClass extends AuthGuard('jwt') {}

export const JwtAuthGuard = UseGuards(JwtAuthGuardClass);
