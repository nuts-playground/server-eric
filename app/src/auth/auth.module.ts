import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { SessionSerializer } from './session.serializer';
import { GithubStrategy } from './strategy/github.strategy';
import { GoogleStrategy } from './strategy/google.strategy';
import { KakaoStrategy } from './strategy/kakao.strategy';
import { NaverStrategy } from './strategy/naver.strategy';

@Module({
    imports: [UserModule, PassportModule.register({ session: true })],
    controllers: [AuthController],
    providers: [AuthService, GoogleStrategy, GithubStrategy, NaverStrategy, KakaoStrategy, SessionSerializer],
})
export class AuthModule {}
