import { Injectable, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
class LocalAuthGuardClass extends AuthGuard('local') {}

export const LocalAuthGuard = UseGuards(LocalAuthGuardClass);
