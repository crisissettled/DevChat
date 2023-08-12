namespace Chat.signalR {
    public interface IChatClient {
        Task ReceiveMessage(string fromUserId, string message);
    }
}
