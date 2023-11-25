using MongoDB.Bson.Serialization.Attributes;

namespace Chat.Model.Response {
    public class ChatMessageResponse {
        public string Id { get; set; }
        public string FromUserId { get; set; }
        public string ToUserId { get; set; }
        public string Message { get; set; }
        public ChatMessageType MessageType { get; set; } = ChatMessageType.Text;
        public string SendAt { get; set; }
        public bool IsSent { get; set; }
        public bool IsRead { get; set; } = false;

        public ChatMessageResponse(string id, string fromUserId, string toUserId, string message, string sendAt, bool isRead, bool isSent) {
            Id = id;
            FromUserId = fromUserId;
            ToUserId = toUserId;
            Message = message;
            SendAt = sendAt;
            IsRead = isRead;
            IsSent = isSent;
        }
    }
}
