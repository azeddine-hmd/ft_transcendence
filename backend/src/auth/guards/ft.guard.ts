import { Injectable } from '@nestjs/common/decorators';
import { UseGuards } from '@nestjs/common/decorators/core/use-guards.decorator';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
class FTAuthGuardClass extends AuthGuard('42') {}

export const FTAuthGuard = UseGuards(FTAuthGuardClass);
