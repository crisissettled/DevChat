﻿using Chat.Model;
using Chat.Model.Configs;
using MongoDB.Driver;

namespace Chat.Utils.MongoDb.ChatMessageService {
    public class MongoDbChatMessageService : MongoDbServiceBase, IMongoDbChatMessageService {
        private readonly IMongoCollection<ChatMessage> _chatMessageCollection;

        public MongoDbChatMessageService() {
            _chatMessageCollection = database.GetCollection<ChatMessage>(MongoDbConfig.ChatMessageCollectionName);

            CreateUniqueIndexOnFromUserIdAndToUserId();
        }

        public async Task<ChatMessage> GetChatMessagesById(string id) {
            var filter = Builders<ChatMessage>.Filter.Eq(x => x.Id, id);
            return await _chatMessageCollection.Find(filter, _caseInsensitiveFindOptions).FirstOrDefaultAsync();
        }

        public async Task<List<ChatMessage>> GetUserChatMessages(string userId) {
            var filter = Builders<ChatMessage>.Filter.Eq(x => x.FromUserId, userId) | Builders<ChatMessage>.Filter.Eq(x => x.ToUserId, userId);
            return await _chatMessageCollection.Find(filter, _caseInsensitiveFindOptions).ToListAsync();
        }

        public async Task<ChatMessage> AddChatMessage(ChatMessage chatMessage) {
            await _chatMessageCollection.InsertOneAsync(chatMessage);
            return chatMessage;
        }

        public async Task<ChatMessage> UpdateChatMessageIsRead(string id) {
            var filter = Builders<ChatMessage>.Filter.Eq(x => x.Id, id);

            var update = Builders<ChatMessage>.Update.Set(x => x.IsRead, true);

            var result = await _chatMessageCollection.UpdateOneAsync(filter, update);

            return await GetChatMessagesById(id);
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
