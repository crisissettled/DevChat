namespace Chat.signalR {
    public interface IChatClient {
        Task ReceiveMessage(string fromUser, string message);
    }
}
