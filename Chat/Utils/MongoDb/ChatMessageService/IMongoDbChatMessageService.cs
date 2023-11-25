using Chat.Model;

namespace Chat.Utils.MongoDb.ChatMessageService {
    public interface IMongoDbChatMessageService {
        Task<ChatMessage> GetChatMessagesById(string id);
        Task<List<ChatMessage>> GetUserChatMessages(string userId);
        Task<ChatMessage> AddChatMessage(ChatMessage chatMessage);
        Task UpdateChatMessage(string id, string message);
        Task<ChatMessage> UpdateChatMessageIsRead(string id);
    }
}