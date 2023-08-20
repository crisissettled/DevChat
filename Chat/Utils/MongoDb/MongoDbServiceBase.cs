using Chat.Model.Configs;
using MongoDB.Driver;

namespace Chat.Utils.MongoDb {
    public abstract class MongoDbServiceBase {
    
        public IMongoDatabase database;
        public MongoDbServiceBase() {
            var _client = new MongoClient(MongoDbConfig.ConnectionString);
            database = _client.GetDatabase(MongoDbConfig.DatabaseName);
        }
    }
}
