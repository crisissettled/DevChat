using Chat.Model;
using Chat.Model.Configs;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Chat.Utils.MongoDb.UserService {
    public class MongoDbLogInStateService : MongoDbServiceBase, IMongoDbLogInStateService {

        private readonly IMongoCollection<LogInState> _logInStateCollection;
        public MongoDbLogInStateService() {
            _logInStateCollection = database.GetCollection<LogInState>(MongoDbConfig.LoginStateCollectionName);

            CreateUniqueIndexOnUserId();
        }


        public async Task<LogInState> GetLogInState(string RefreshToken) {
            var filter = Builders<LogInState>.Filter.Eq(x => x.RefreshToken, RefreshToken);
            return await _logInStateCollection.Find(filter).FirstOrDefaultAsync();
        }

        public async Task UpsertLoginState(LogInState logInState) {
            var filter = Builders<LogInState>.Filter.Eq(x => x.UserId, logInState.UserId);

            var update = Builders<LogInState>.Update.Set(x => x.Token, logInState.Token)
                            .Set(x => x.RefreshToken, logInState.RefreshToken)
                            .Set(x => x.KeepLoggedIn, logInState.KeepLoggedIn)
                            .Set(x => x.IsSignedOut, logInState.IsSignedOut)
                            .Set(x => x.UpdatedAt, DateTime.Now);


            UpdateOptions opts = new UpdateOptions() {
                IsUpsert = true
            };

            await _logInStateCollection.UpdateOneAsync(filter, update, opts);
        }

        public async Task UpdateSignOut(string UserId, bool IsSignedOut = true) {
            var filter = Builders<LogInState>.Filter.Eq(x => x.UserId, UserId);
            var update = Builders<LogInState>.Update.Set(x => x.IsSignedOut, IsSignedOut)
                .Set(x => x.Token,string.Empty)
                .Set(x => x.RefreshToken,string.Empty);

            await _logInStateCollection.UpdateOneAsync(filter, update);
        }

        #region Index creation
        private void CreateUniqueIndexOnUserId() {
            var indexModel = new CreateIndexModel<LogInState>(
                new IndexKeysDefinitionBuilder<LogInState>().Ascending(x => x.UserId),
                new CreateIndexOptions() { Unique = true, Name = Constants.IDX_USER_UserId, Background = true, Collation = new Collation("en", strength: CollationStrength.Primary) } // Case-Insensitive index
             );

            var indexes = _logInStateCollection.Indexes.List().ToList().Select(x => x.GetElement("name").Value.ToString()).ToList();
            if (indexes.Any(x => x != null && x.Equals(Constants.IDX_USER_UserId))) {
                _logInStateCollection.Indexes.CreateOne(indexModel);
            }
        }
        #endregion

    }
}
