import { Controller, Param, Post, Get, UseGuards } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { UserDto } from 'src/Dto/create-user.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Controller('friends')
export class FriendsController {

    constructor(private readonly friendsService: FriendsService) { }

    @UseGuards(JwtGuard)
    @Post(':userId/:friendId')
    async addFriend(@Param('userId') userId: number, @Param('friendId') friendId: number): Promise<void> {
        await this.friendsService.addFriend(userId, friendId);
    }

    @Post('accept/:userId/:friendId')
    async acceptFriend(@Param('userId') userId: number, @Param('friendId') friendId: number): Promise<void> {
        await this.friendsService.acceptFriendship(userId, friendId);
    }

    @Post('reject/:userId/:friendId')
    async rejectFriend(@Param('userId') userId: number, @Param('friendId') friendId: number): Promise<void> {
        await this.friendsService.rejectFriendship(userId, friendId);
    }

    @UseGuards(JwtGuard)
    @Get(':userId')
    async getFriends(@Param('userId') userId: string): Promise<UserDto[]> {
        const parsedUserId = parseInt(userId, 10); // Convert the string to a number
        const friends = await this.friendsService.getFriends(parsedUserId);
        return friends;
    }

    @Get(':userId/friends/pending')
    async getPendingFriends(@Param('userId') userId: string): Promise<UserDto[]> {
        const parsedUserId = parseInt(userId, 10);
        const pendingFriends = await this.friendsService.getFriendsWithStatus(parsedUserId, 'pending');
        return pendingFriends;
    }

}
