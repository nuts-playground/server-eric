import { BoardComment } from '../../entity/board-comment.entity';

export class CreateCommentDto {
    private readonly user_email: string;
    private readonly content_id: number;
    private readonly comment: string;

    constructor(userEmail: string, contentId: number, comment: string) {
        this.user_email = userEmail;
        this.content_id = contentId;
        this.comment = comment;
    }
    getEmail() {
        return this.user_email;
    }

    getContentId() {
        return this.content_id;
    }

    private isComment() {
        const titleLength = this.comment.length;
        return 2 < titleLength && titleLength <= 100;
    }

    private isEmail() {
        const regExp =
            /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
        return regExp.test(this.user_email);
    }

    toEntity(userId: number) {
        if (!this.isComment()) {
            return '댓글은 2글자 이상, 100글자 이하여야 합니다.';
        }

        if (!this.isEmail()) {
            return '올바른 이메일 형식이 아닙니다.';
        }
        return BoardComment.from(this.content_id, userId, this.comment);
    }
}
