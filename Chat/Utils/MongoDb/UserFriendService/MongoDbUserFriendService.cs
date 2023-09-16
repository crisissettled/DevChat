using Chat.Model;
using Chat.Model.Configs;
using MongoDB.Driver;

namespace Chat.Utils.MongoDb.UserFirendService {
    public class MongoDbUserFriendService : MongoDbServiceBase, IMongoDbUserFriendService {

        private readonly IMongoCollection<UserFriend> _userFriendCollection;
        public MongoDbUserFriendService() {
            _userFriendCollection = database.GetCollection<UserFriend>(MongoDbConfig.UserFriendCollectionName);
        }

        public async Task<List<UserFriend>> GetUserFriendList(string UserId) {
            var filter = Builders<UserFriend>.Filter.Eq(x => x.UserId, UserId) | Builders<UserFriend>.Filter.Eq(x => x.FriendUserId, UserId);

            return await _userFriendCollection.Find(filter, new FindOptions() { Collation = new Collation("en", strength: CollationStrength.Primary) }).ToListAsync();
        }

        public async Task AddUserFriend(UserFriend userFriend) {
            await _userFriendCollection.InsertOneAsync(userFriend);
        }

        public async Task UpdateUserFriendMessage(string UserId, string FriendUserId, UserFriendMessage Message, UserFriendMessageType MessageType) {
            var filter = Builders<UserFriend>.Filter.Eq(x => x.UserId, UserId) & Builders<UserFriend>.Filter.Eq(x => x.FriendUserId, FriendUserId);

            var updateBuilder = Builders<UserFriend>.Update;
            UpdateDefinition<UserFriend> update;
            switch (MessageType) {
                case UserFriendMessageType.Send:
                    update = updateBuilder.Push(x => x.MessageOut, Message);
                    break;
                case UserFriendMessageType.Reply:
                    update = updateBuilder.Push(x => x.MessageIn, Message);
                    break;
                default:
                    return;
            }

            await _userFriendCollection.UpdateOneAsync(filter, update);
        }

        public async Task AcceptOrDenyFriend(string UserId, string FriendUserId, FriendRequestStatus friendRequestStatus) {
            var filter = (Builders<UserFriend>.Filter.Eq(x => x.UserId, UserId) & Builders<UserFriend>.Filter.Eq(x => x.FriendUserId, FriendUserId))
                          | (Builders<UserFriend>.Filter.Eq(x => x.UserId, FriendUserId) & Builders<UserFriend>.Filter.Eq(x => x.FriendUserId, UserId));
            var updateBuilder = Builders<UserFriend>.Update;

            var update = updateBuilder.Set(x => x.AcceptOrDeniedAt, DateTime.Now)
                              .Set(x => x.FriendStatus, friendRequestStatus);

            await _userFriendCollection.UpdateOneAsync(filter, update, new UpdateOptions() { Collation = new Collation("en", strength: CollationStrength.Primary) });
        }
    }
}
