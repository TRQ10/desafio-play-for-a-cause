import { Controller, Param, Post, Get } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { UserDto } from 'src/Dto/create-user.dto';
import { EventsGateway } from 'src/events/events.gateway';

@Controller('friends')
export class FriendsController {

    constructor(
        private readonly friendsService: FriendsService,
        private readonly eventsGateway: EventsGateway) { }

    @Post(':userId/:friendId')
    async addFriend(
        @Param('userId') userId: number,
        @Param('friendId') friendId: number,
    ): Promise<void> {
        await this.friendsService.addFriend(userId, friendId);

        const payload = {
            senderId: userId,
            friendId: friendId,
            message: 'You have a new friend request!',
        };

        this.eventsGateway.handleFriendRequest(payload);
    }

    @Post('accept/:userId/:friendId')
    async acceptFriend(@Param('userId') userId: number, @Param('friendId') friendId: number): Promise<void> {
        await this.friendsService.acceptFriendship(userId, friendId);

        // Notificar o cliente sobre a aceitação do pedido de amizade
        const payload = {
            senderId: friendId,
            friendId: userId,
            message: 'Your friend request has been accepted!',
        };

        this.eventsGateway.acceptFriendRequest(payload);
    }

    @Post('reject/:userId/:friendId')
    async rejectFriend(@Param('userId') userId: number, @Param('friendId') friendId: number): Promise<void> {
        await this.friendsService.rejectFriendship(userId, friendId);

        // Notificar o cliente sobre a rejeição do pedido de amizade
        const payload = {
            senderId: friendId,
            friendId: userId,
            message: 'Your friend request has been rejected.',
        };

        this.eventsGateway.rejectFriendRequest(payload);
    }

    @Get(':userId')
    async getFriends(@Param('userId') userId: string): Promise<UserDto[]> {
        const parsedUserId = parseInt(userId, 10); // Convert the string to a number
        const friends = await this.friendsService.getFriends(parsedUserId);

        this.eventsGateway.sendUpdatedFriendsList(friends);

        return friends;
    }

    @Get(':userId/friends/pending')
    async getPendingFriends(@Param('userId') userId: string): Promise<UserDto[]> {
        const parsedUserId = parseInt(userId, 10);
        const pendingFriends = await this.friendsService.getFriendsWithStatus(parsedUserId, 'pending');

        // Notificar o cliente sobre pedidos de amizade pendentes
        const payload = {
            userId: parsedUserId,
            pendingFriends: pendingFriends,
        };
        this.eventsGateway.friendPendingRequest(payload);

        return pendingFriends;
    }

}
