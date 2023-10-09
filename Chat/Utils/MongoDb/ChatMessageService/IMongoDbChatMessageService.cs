using Chat.Model;

namespace Chat.Utils.MongoDb.ChatMessageService {
    public interface IMongoDbChatMessageService {
        Task CreateChatMessage(ChatMessage chatMessage);
        Task UpdateChatMessage(string id, string message);
        Task UpdateChatMessageIsRead(string id);
    }
}