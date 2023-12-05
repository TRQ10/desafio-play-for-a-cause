import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FriendshipDto, FriendshipKey, UserDto } from '../Dto/create-user.dto';

@Injectable()
export class FriendsService {

    constructor(private readonly prisma: PrismaService) { }

    async addFriend(userId: number, friendId: number): Promise<{ success: boolean; message?: string }> {
        try {
            const userIdInt = parseInt(userId.toString());
            const friendIdInt = parseInt(friendId.toString());

            const existingFriendship = await this.prisma.friendship.findFirst({
                where: {
                    OR: [
                        { user1Id: userIdInt, user2Id: friendIdInt },
                        { user1Id: friendIdInt, user2Id: userIdInt },
                    ],
                },
            });

            if (existingFriendship) {
                throw new ConflictException('Friendship already exists');
            }

            // Create the friendship in both directions
            await this.prisma.friendship.create({
                data: {
                    user1Id: userIdInt,
                    user2Id: friendIdInt,
                },
            });

            await this.prisma.friendship.create({
                data: {
                    user1Id: friendIdInt,
                    user2Id: userIdInt,
                },
            });

            return { success: true, message: 'Friendship added successfully' };
        } catch (error) {
            // Handle validation errors or other exceptions
            if (error instanceof ConflictException) {
                // ConflictException indicates a constraint violation
                return { success: false, message: error.message };
            }
            // Propagate other errors
            return { success: false, message: 'An error occurred while adding the friendship' };
        }
    }

    async getFriends(userId: number): Promise<UserDto[]> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const friendsMap = new Map<number, UserDto>();

        // Adding user1Friends to the map
        const user1Friends = await this.prisma.friendship
            .findMany({
                where: { user1Id: userId },
                include: { user2: true },
            })
            .then((friendships: FriendshipDto[]) => friendships.map((friendship) => friendship.user2));

        user1Friends.forEach((friend) => {
            friendsMap.set(friend.id, friend);
        });

        // Adding user2Friends to the map, avoiding duplicates
        const user2Friends = await this.prisma.friendship
            .findMany({
                where: { user2Id: userId },
                include: { user1: true },
            })
            .then((friendships: FriendshipDto[]) => friendships.map((friendship) => friendship.user1));

        user2Friends.forEach((friend) => {
            if (!friendsMap.has(friend.id)) {
                friendsMap.set(friend.id, friend);
            }
        });

        const uniqueFriends = Array.from(friendsMap.values());
        return uniqueFriends;
    }

    async getFriendsWithStatus(userId: number, status: string): Promise<UserDto[]> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const friendships = await this.prisma.friendship.findMany({
            where: {
                OR: [
                    { user1Id: userId, status: status },
                    { user2Id: userId, status: status },
                ],
            },
            include: {
                user1: true,
                user2: true,
            },
        });

        const uniqueFriends: UserDto[] = [];
        const friendIds = new Set<number>();

        friendships.forEach((friendship) => {
            const friend = friendship.user1.id === userId ? friendship.user2 : friendship.user1;

            if (!friendIds.has(friend.id)) {
                uniqueFriends.push(friend);
                friendIds.add(friend.id);
            }
        });

        return uniqueFriends;
    }

    async acceptFriendship(user1Id: number, user2Id: number): Promise<void> {
        const friendshipKey: FriendshipKey = { user1Id, user2Id };


        await this.prisma.friendship.updateMany({
            where: {
                OR: [
                    { user1Id: parseInt(friendshipKey.user1Id.toString()), user2Id: parseInt(friendshipKey.user2Id.toString()) },
                    { user1Id: parseInt(friendshipKey.user2Id.toString()), user2Id: parseInt(friendshipKey.user1Id.toString()) },
                ],
            },
            data: { status: 'accepted' },
        });
    }

    async rejectFriendship(user1Id: number, user2Id: number): Promise<void> {
        const friendshipKey: FriendshipKey = { user1Id, user2Id };

        await this.prisma.friendship.deleteMany({
            where: {
                OR: [
                    { user1Id: parseInt(friendshipKey.user1Id.toString()), user2Id: parseInt(friendshipKey.user2Id.toString()) },
                    { user1Id: parseInt(friendshipKey.user2Id.toString()), user2Id: parseInt(friendshipKey.user1Id.toString()) },
                ],
            },
        });
    }

}
