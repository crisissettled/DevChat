using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Chat.Model {
    public class ChatMessage {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string FromUserId { get; set; }
        public string ToUserId { get; set; }
        public string Message { get; set; }
        public ChatMessageType MessageType { get; set; } = ChatMessageType.Text;

        [BsonDateTimeOptions(Kind = DateTimeKind.Local)]
        public DateTime SendAt { get; set; } = DateTime.Now;
        public bool IsRead { get; set; } = false;

        public ChatMessage(string fromUserId, string toUserId, string message) {
            FromUserId = fromUserId;
            ToUserId = toUserId;
            Message = message;
        }
    }
}
