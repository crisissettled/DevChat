using Chat.Model;
using Chat.Model.Configs;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Chat.Utils.MongoDb {
    public class MongoDbUserService : IMongoDbUserService {

        private readonly IMongoCollection<User> _userCollection;

        public MongoDbUserService() {
            MongoClient client = new MongoClient(MongoDbConfig.ConnectionString);
            IMongoDatabase database = client.GetDatabase(MongoDbConfig.DatabaseName);
            _userCollection = database.GetCollection<User>(MongoDbConfig.UserCollectionName);


            CreateUniqueIndexOnUserId();
        }

        public async Task<User> GetUserAsync(string UserId) {

            var filter = Builders<User>.Filter.Eq(x => x.UserId, UserId);
            return await _userCollection
                .Find(filter, new FindOptions() { Collation = new Collation("en", strength: CollationStrength.Primary) }) // Case-Insensitive query
                .FirstOrDefaultAsync();
        }

        public async Task<List<User>> GetUserListByKeywordAsync(string Keyword) {
            var filter = Builders<User>.Filter.Or(
                Builders<User>.Filter.Regex(x => x.UserId, new BsonRegularExpression($".*{Keyword}.*", "i")),
                Builders<User>.Filter.Regex(x => x.Name, new BsonRegularExpression($".*{Keyword}.*", "i"))
             );

            return await _userCollection.Find(filter).ToListAsync();
        }

        public async Task CreateUserAsync(User user) {
            await _userCollection.InsertOneAsync(user);
        }


        #region Index creation
        private void CreateUniqueIndexOnUserId() {
            var indexModel = new CreateIndexModel<User>(
                new IndexKeysDefinitionBuilder<User>().Ascending(x => x.UserId),
                new CreateIndexOptions() { Unique = true, Name = Constants.IDX_USER_UserId, Background = true, Collation = new Collation("en", strength: CollationStrength.Primary) } // Case-Insensitive index
             );

            var indexes = _userCollection.Indexes.List().ToList().Select(x => x.GetElement("name").Value.ToString()).ToList();
            if (indexes.Any(x => x != null && x.Equals(Constants.IDX_USER_UserId))) {
                _userCollection.Indexes.CreateOne(indexModel);
            }
        }
        #endregion
    }
}