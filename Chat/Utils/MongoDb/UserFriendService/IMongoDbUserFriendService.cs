using Chat.Model;

namespace Chat.Utils.MongoDb.UserFirendService {
    public interface IMongoDbUserFriendService {
        Task<List<UserFriend>> GetUserFriendList(string UserId);
    }
}