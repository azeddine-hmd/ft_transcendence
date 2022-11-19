import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist/config.module';
import { EnvService } from './env.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.postgres.env', '.env', '.profile.env'],
      expandVariables: true,
    }),
  ],
  providers: [EnvService],
  exports: [ConfigModule, EnvService],
})
@Global()
export class ConfModule {}
