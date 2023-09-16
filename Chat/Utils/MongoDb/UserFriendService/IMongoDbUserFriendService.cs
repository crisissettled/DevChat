using Chat.Model;

namespace Chat.Utils.MongoDb.UserFirendService {
    public interface IMongoDbUserFriendService {
        Task<List<UserFriend>> GetUserFriendList(string UserId);

        Task AddUserFriend(UserFriend userFriend);

        Task UpdateUserFriendMessage(string UserId, string FriendUserId, UserFriendMessage Message, UserFriendMessageType MessageType);

        Task AcceptOrDenyFriend(string UserId, string FriendUserId, FriendRequestStatus friendRequestStatus);
    }
}