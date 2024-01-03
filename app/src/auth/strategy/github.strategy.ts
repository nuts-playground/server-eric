import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { githubConfig } from '../../config/github.config';
import { UserSignUpDto } from '../../user/dto/user-signup.dto';
import { UserService } from '../../user/user.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy) {
    constructor(private userService: UserService) {
        super(githubConfig.getConfig());
    }

    async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
        const { id, username, displayName, photos, provider } = profile;
        console.log(profile);
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        const member = await this.userService.findByEmail(email);

        if (!member) {
            const userSignUpDto = new UserSignUpDto(email, username, provider);
            return await this.userService.signUp(userSignUpDto);
        } else {
            return member;
        }
    }
}