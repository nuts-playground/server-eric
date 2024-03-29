import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { githubConfig } from '../../config/github.config';
import { SignupDto } from '../../user/dto/signup.dto';
import { User } from '../../user/entity/user.entity';
import { UserService } from '../../user/service/user.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy) {
    constructor(private userService: UserService) {
        super(githubConfig.getConfig());
    }

    async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
        const { id, username, displayName, photos, provider } = profile;
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        const member = await this.userService.findByEmail(email);

        if (!member) {
            const userSignUpDto = new SignupDto(email, username, provider);

            if (userSignUpDto.toEntity() instanceof User) {
                return await this.userService.signUp(userSignUpDto);
            } else {
                return userSignUpDto.validateParam();
            }
        } else {
            return member;
        }
    }
}
