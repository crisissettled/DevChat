using Chat.Model;

namespace Chat.Utils.MongoDb.ChatMessageService {
    public interface IMongoDbChatMessageService {
        Task<List<ChatMessage>> GetUserChatMessages(string userId);
        Task<ChatMessage> AddChatMessage(ChatMessage chatMessage);
        Task UpdateChatMessage(string id, string message);
        Task UpdateChatMessageIsRead(string id);
    }
}