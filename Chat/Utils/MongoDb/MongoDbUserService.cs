using Chat.Model;
using Chat.Model.Configs;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using System.Runtime.Intrinsics.X86;

namespace Chat.Utils.MongoDb {
    public class MongoDbUserService : IMongoDbUserService {

        private readonly IMongoCollection<User> _userCollection;

        public MongoDbUserService() {
            MongoClient client = new MongoClient(MongoDbConfig.ConnectionString);
            IMongoDatabase database = client.GetDatabase(MongoDbConfig.DatabaseName);
            _userCollection = database.GetCollection<User>(MongoDbConfig.UserCollectionName);            
        }

        public async Task<User> GetUserAsync(string UserId) {
            
            var filter = Builders<User>.Filter.Eq(x => x.UserId,UserId);
            return await _userCollection.Find(filter).FirstOrDefaultAsync();           
        }

        public async Task CreateUserAsync(User user) {
            await CreateUniqueIndexOnUserId();
            await _userCollection.InsertOneAsync(user);
        }


        private async Task CreateUniqueIndexOnUserId() {
            var indexModel = new CreateIndexModel<User>(
                new IndexKeysDefinitionBuilder<User>().Ascending(x => x.UserId),
                new CreateIndexOptions() { Unique = true }
             );

            await _userCollection.Indexes.CreateOneAsync(indexModel);
        }

    }
}
