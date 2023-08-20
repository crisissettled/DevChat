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
            var filter = Builders<UserFriend>.Filter.Eq(x => x.UserId, UserId);

            return await _userFriendCollection.Find(filter, new FindOptions() { Collation = new Collation("en", strength: CollationStrength.Primary) }).ToListAsync();
        }
    }
}
