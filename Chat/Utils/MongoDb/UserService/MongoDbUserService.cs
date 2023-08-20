using Chat.Model;
using Chat.Model.Configs;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Chat.Utils.MongoDb.UserService {
    public class MongoDbUserService : MongoDbServiceBase, IMongoDbUserService {

        private readonly IMongoCollection<User> _userCollection;

        public MongoDbUserService() {
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


        public async Task UpdateUserAsync(User user) {
            var filter = Builders<User>.Filter.Eq(x => x.UserId, user.UserId);

            var updateBuilder = Builders<User>.Update;
            var update = updateBuilder.Set(x => x.Gender, user.Gender);
            update = update.Set(x => x.Name, user.Name);

            if (!string.IsNullOrEmpty(user.Password)) update = update.Set(x => x.Password, user.Password);            
            if (user.Province != null) update = update.Set(x => x.Province, user.Province);
            if (user.City != null) update = update.Set(x => x.City, user.City);
            if (user.Address != null) update = update.Set(x => x.Address, user.Address);
            if (user.Phone != null) update = update.Set(x => x.Phone, user.Phone);
            if (user.Email != null) update = update.Set(x => x.Email, user.Email);


            await _userCollection.UpdateOneAsync(filter, update, new UpdateOptions() { Collation = new Collation("en", strength: CollationStrength.Primary) });
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