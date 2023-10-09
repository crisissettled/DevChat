namespace Chat.Model.Request {
    public record ChatMessageRequest(string toUserId, string message);
}
