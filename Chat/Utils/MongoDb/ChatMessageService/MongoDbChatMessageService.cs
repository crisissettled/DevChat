using Chat.Model;
using Chat.Model.Configs;
using MongoDB.Driver;

namespace Chat.Utils.MongoDb.ChatMessageService {
    public class MongoDbChatMessageService : MongoDbServiceBase, IMongoDbChatMessageService {
        private readonly IMongoCollection<ChatMessage> _chatMessageCollection;

        public MongoDbChatMessageService() {
            _chatMessageCollection = database.GetCollection<ChatMessage>(MongoDbConfig.ChatMessageCollectionName);

            CreateUniqueIndexOnFromUserIdAndToUserId();
        }

        public async Task<ChatMessage> AddChatMessage(ChatMessage chatMessage) {
            await _chatMessageCollection.InsertOneAsync(chatMessage);
            return chatMessage;
        }

        public async Task UpdateChatMessageIsRead(string id) {
            var filter = Builders<ChatMessage>.Filter.Eq(x => x.Id, id);

            var update = Builders<ChatMessage>.Update.Set(x => x.IsRead, true);

            await _chatMessageCollection.UpdateOneAsync(filter, update);
        }

        public async Task UpdateChatMessage(string id, string message) {

            if (string.IsNullOrWhiteSpace(message) == true) return;

            var filter = Builders<ChatMessage>.Filter.Eq(x => x.Id, id);

            var update = Builders<ChatMessage>.Update.Set(x => x.Message, message);

            await _chatMessageCollection.UpdateOneAsync(filter, update);
        }


        #region Index creation
        private void CreateUniqueIndexOnFromUserIdAndToUserId() {
            var indexModel = new CreateIndexModel<ChatMessage>(
                new IndexKeysDefinitionBuilder<ChatMessage>().Ascending(x => x.FromUserId).Ascending(x => x.ToUserId),
                new CreateIndexOptions() { Name = Constants.IDX_ChatMessage_FromUserId_ToUserId, Background = true, Collation = new Collation("en", strength: CollationStrength.Primary) } // Case-Insensitive index
             );

            var indexes = _chatMessageCollection.Indexes.List().ToList().Select(x => x.GetElement("name").Value.ToString()).ToList();
            if (indexes.Any(x => x != null && x.Equals(Constants.IDX_ChatMessage_FromUserId_ToUserId))) {
                _chatMessageCollection.Indexes.CreateOne(indexModel);
            }
        }
        #endregion
    }
}
