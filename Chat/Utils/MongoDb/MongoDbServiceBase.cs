using Chat.Model.Configs;
using MongoDB.Driver;

namespace Chat.Utils.MongoDb {
    public abstract class MongoDbServiceBase {
    
        protected readonly IMongoDatabase database;
        protected readonly FindOptions _caseInsensitiveFindOptions; 
        public MongoDbServiceBase() {
            var _client = new MongoClient(MongoDbConfig.ConnectionString);
            database = _client.GetDatabase(MongoDbConfig.DatabaseName);
            _caseInsensitiveFindOptions = new FindOptions() { Collation = new Collation("en", strength: CollationStrength.Primary) };
        }
    }
}
