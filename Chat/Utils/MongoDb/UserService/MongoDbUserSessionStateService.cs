using Chat.Model;
using Chat.Model.Configs;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Chat.Utils.MongoDb.UserService {
    public class MongoDbUserSessionStateService : MongoDbServiceBase, IMongoDbUserSessionStateService {

        private readonly IMongoCollection<UserSessionState> _userSessionStateCollection;
        public MongoDbUserSessionStateService() {
            _userSessionStateCollection = database.GetCollection<UserSessionState>(MongoDbConfig.UserSessionStateCollectionName);

            CreateUniqueIndexOnUserId();
        }


        public async Task<UserSessionState> GetUserSessionState(string RefreshToken) {
            var filter = Builders<UserSessionState>.Filter.Eq(x => x.RefreshToken, RefreshToken);
            return await _userSessionStateCollection.Find(filter).FirstOrDefaultAsync();
        }

        public async Task UpsertUserSessionState(UserSessionState userSessionState) {
            var filter = Builders<UserSessionState>.Filter.Eq(x => x.UserId, userSessionState.UserId);

            var update = Builders<UserSessionState>.Update.Set(x => x.Token, userSessionState.Token)
                            .Set(x => x.RefreshToken, userSessionState.RefreshToken)
                            .Set(x => x.KeepLoggedIn, userSessionState.KeepLoggedIn)
                            .Set(x => x.IsSignedOut, userSessionState.IsSignedOut)
                            .Set(x => x.UpdatedAt, DateTime.Now);


            UpdateOptions opts = new UpdateOptions() {
                IsUpsert = true
            };

            await _userSessionStateCollection.UpdateOneAsync(filter, update, opts);
        }

        public async Task UpdateSignOut(string UserId, bool IsSignedOut = true) {
            var filter = Builders<UserSessionState>.Filter.Eq(x => x.UserId, UserId);
            var update = Builders<UserSessionState>.Update.Set(x => x.IsSignedOut, IsSignedOut)
                .Set(x => x.Token,string.Empty)
                .Set(x => x.RefreshToken,string.Empty);

            await _userSessionStateCollection.UpdateOneAsync(filter, update);
        }

        #region Index creation
        private void CreateUniqueIndexOnUserId() {
            var indexModel = new CreateIndexModel<UserSessionState>(
                new IndexKeysDefinitionBuilder<UserSessionState>().Ascending(x => x.UserId),
                new CreateIndexOptions() { Unique = true, Name = Constants.IDX_USER_UserId, Background = true, Collation = new Collation("en", strength: CollationStrength.Primary) } // Case-Insensitive index
             );

            var indexes = _userSessionStateCollection.Indexes.List().ToList().Select(x => x.GetElement("name").Value.ToString()).ToList();
            if (indexes.Any(x => x != null && x.Equals(Constants.IDX_USER_UserId))) {
                _userSessionStateCollection.Indexes.CreateOne(indexModel);
            }
        }
        #endregion

    }
}
