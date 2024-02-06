import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BoardComment } from '../../board/entity/board-comment.entity';
import { BoardContent } from '../../board/entity/board-content.entity';
import { BoardLike } from '../../board/entity/board-like.entity';
import { CommonTimstamp } from '../../common/entity/common-timstamp.entity';
import { ProviderIdEnum } from '../enum/provider-id-enum';
/*
 * 데이터베이스 USER 테이블과 매핑되는 Entity
 * User 테이블에 들어가는 데이터는 모두 여기서 관장한다.
 * */

@Entity({ name: 'user' })
export class User extends CommonTimstamp {
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column()
    user_email: string;

    @Column()
    user_name: string;

    @Column()
    provider_id: ProviderIdEnum;

    @OneToMany(() => BoardContent, (boardContent) => boardContent.user, {
        cascade: ['update'],
        nullable: false,
    })
    boardContent: BoardContent[];

    @OneToMany(() => BoardComment, (boardComment) => boardComment.user, {
        cascade: ['update'],
        nullable: false,
    })
    boardComment: BoardComment[];

    @OneToMany(() => BoardLike, (boardLike) => boardLike.user, {
        cascade: ['update'],
        nullable: false,
    })
    boardLike: BoardLike[];

    static from(
        userEmail: string,
        userName: string,
        providerId: ProviderIdEnum,
    ): User {
        const user = new User();
        user.user_email = userEmail;
        user.user_name = userName;
        user.provider_id = providerId;
        return user;
    }
}
