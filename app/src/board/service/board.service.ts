import { Injectable } from '@nestjs/common';
import { FindOneOptions, UpdateResult } from 'typeorm';
import { DateUtil } from '../../common/utils/date.util';
import { User } from '../../user/entity/user.entity';
import { UserService } from '../../user/service/user.service';
import { CreateCommentDto } from '../dto/comment/create-comment.dto';
import { DeleteCommentDto } from '../dto/comment/delete-comment.dto';
import { UpdateCommentDto } from '../dto/comment/update-comment.dto';
import { CreateContentDto } from '../dto/content/create-content.dto';
import { DeleteContentDto } from '../dto/content/delete-content.dto';
import { UpdateContentDto } from '../dto/content/update-content.dto';
import { BoardCategory } from '../entity/board-category.entity';
import { BoardComment } from '../entity/board-comment.entity';
import { BoardContent } from '../entity/board-content.entity';
import { BoardCategoryRepository } from '../repository/board-category.repository';
import { BoardCommentRepository } from '../repository/board-comment.repository';
import { BoardContentRepository } from '../repository/board-content.repository';

@Injectable()
export class BoardService {
    constructor(
        private readonly userService: UserService,
        private readonly boardCategoryRepository: BoardCategoryRepository,
        private readonly boardContentRepository: BoardContentRepository,
        private readonly boardCommentRepository: BoardCommentRepository,
    ) {}

    async findContent(
        contentId: number,
        categoryId?: number,
        userId?: number,
    ): Promise<BoardContent | null> {
        const queryBuilder = this.boardContentRepository.createQueryBuilder('boardContent');
        queryBuilder.leftJoinAndSelect('boardContent.user_id', 'user');
        queryBuilder.where('boardContent.content_id = :contentId', { contentId });
        if (categoryId) {
            queryBuilder.andWhere('boardContent.category_id = :categoryId', { categoryId });
        }
        if (userId) {
            queryBuilder.andWhere('boardContent.user_id = :userId', { userId });
        }
        const result = await queryBuilder
            .select([
                'boardContent.create_dtm',
                'boardContent.update_dtm',
                'boardContent.content_id',
                'boardContent.title',
                'boardContent.content',
                'user.user_name',
                'user.user_email',
                'user.provider_id',
            ])
            .getOne();

        return result;
    }

    async findComment(
        commentId: number,
        contentId: number,
        userId: number,
    ): Promise<BoardComment | null> {
        const query: any = { where: { comment_id: commentId } };
        if (contentId) query.where.content_id = contentId;
        if (userId) query.where.user_id = userId;

        return await this.boardCommentRepository.findOne(query);
    }

    async getCategoryList(): Promise<BoardCategory[] | null> {
        return await this.boardCategoryRepository.find();
    }

    async getLatestContentList(): Promise<BoardContent[] | null> {
        return await this.boardContentRepository.find({
            take: 50,
            order: {
                content_id: 'DESC',
            },
        });
    }

    async getCommentList(targetId: number): Promise<BoardComment[] | null> {
        return await this.boardCommentRepository.find({
            where: { content_id: targetId },
            order: {
                comment_id: 'DESC'
            }
        });
    }

    async createContent(
        createContentDto: CreateContentDto,
    ): Promise<string | BoardContent | boolean> {
        const reqUserEmail = createContentDto.getUserEmail();
        const user = await this.userService.findByEmail(reqUserEmail);

        const notFoundUser = !(user instanceof User);

        if (notFoundUser) return user;

        const userId = user.user_id;
        const boardContent = createContentDto.toEntity(userId);
        const validateContent = !(boardContent instanceof BoardContent);

        if (validateContent) return boardContent;

        return await this.boardContentRepository.save(boardContent);
    }

    async deleteContent(deleteContentDto: DeleteContentDto): Promise<BoardContent | boolean> {
        const reqUserEmail = deleteContentDto.getUserEmail();
        const user = await this.userService.findByEmail(reqUserEmail);
        const notFoundUser = !(user instanceof User);
        const curTime = DateUtil.dateNow();

        if (notFoundUser) return false;

        const targetFindContent = await this.findContent(
            deleteContentDto.getContentId(),
            deleteContentDto.getCategoryId(),
            user.user_id,
        );
        const notFoundContent = !(targetFindContent instanceof BoardContent);
        if (notFoundContent) return false;

        targetFindContent.delete_dtm = curTime;
        targetFindContent.update_dtm = curTime;
        return await this.boardContentRepository.save(targetFindContent);
    }

    async updateContent(updateContentDto: UpdateContentDto): Promise<UpdateResult | boolean> {
        const reqUserEmail = updateContentDto.getEmail();
        const user = await this.userService.findByEmail(reqUserEmail);

        const notFoundUser = !(user instanceof User);
        if (notFoundUser) return false;

        const targetFindContent = await this.findContent(
            updateContentDto.getContentId(),
            updateContentDto.getCategoryId(),
            user.user_id,
        );

        const notFoundContent = !(targetFindContent instanceof BoardContent);
        if (notFoundContent) return false;

        return await this.boardContentRepository.update(
            updateContentDto.getContentId(),
            updateContentDto.getUpdateContent(),
        );
    }

    async createComment(
        createCommentDto: CreateCommentDto,
    ): Promise<BoardComment | string | boolean> {
        const reqUserEmail = createCommentDto.getEmail();
        const user = await this.userService.findByEmail(reqUserEmail);

        const notFoundUser = !(user instanceof User);
        if (notFoundUser) return false;

        const reqContent = await this.boardContentRepository.findOneBy({
            content_id: createCommentDto.getContentId(),
        });
        const notFoundContent = !(reqContent instanceof BoardContent);
        if (notFoundContent) return false;

        const userId = user.user_id;
        const boardComment = createCommentDto.toEntity(userId);
        const validateContent = !(boardComment instanceof BoardComment);

        if (validateContent) return boardComment;
        return await this.boardCommentRepository.save(boardComment);
    }

    async updateComment(updateCommentDto: UpdateCommentDto): Promise<UpdateResult | boolean> {
        const reqUserEmail = updateCommentDto.getEmail();
        const user = await this.userService.findByEmail(reqUserEmail);

        const notFoundUser = !(user instanceof User);
        if (notFoundUser) return false;

        const targetFindComment = await this.findComment(
            updateCommentDto.getCommentId(),
            updateCommentDto.getContentId(),
            user.user_id,
        );

        const notFoundComment = !(targetFindComment instanceof BoardComment);
        if (notFoundComment) return false;

        return await this.boardCommentRepository.update(
            updateCommentDto.getCommentId(),
            updateCommentDto.getComment(),
        );
    }

    async deleteComment(deleteCommentDto: DeleteCommentDto) {
        const reqUserEmail = deleteCommentDto.getEmail();
        const user = await this.userService.findByEmail(reqUserEmail);
        const notFoundUser = !(user instanceof User);
        const curTime = DateUtil.dateNow();
        if (notFoundUser) return false;

        const targetFindComment = await this.findComment(
            deleteCommentDto.getCommentId(),
            deleteCommentDto.getContentId(),
            user.user_id,
        );
        const notFoundContent = !(targetFindComment instanceof BoardComment);

        if (notFoundContent) return false;

        targetFindComment.delete_dtm = curTime;
        targetFindComment.update_dtm = curTime;
        return await this.boardCommentRepository.save(targetFindComment);
    }
}
