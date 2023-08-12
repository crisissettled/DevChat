using Chat.Model;
using Chat.Model.Configs;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace Chat.Utils.MongoDb {
    public class MongoDbUserService : IMongoDbUserService {

        private readonly IMongoCollection<User> _userCollection;

        public MongoDbUserService() {
            MongoClient client = new MongoClient(MongoDbConfig.ConnectionString);
            IMongoDatabase database = client.GetDatabase(MongoDbConfig.DatabaseName);
            _userCollection = database.GetCollection<User>(MongoDbConfig.UserCollectionName);
        }

        public async Task CreateAsync(User user) {
            await _userCollection.InsertOneAsync(user);
        }

    }
}
