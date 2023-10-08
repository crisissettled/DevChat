namespace Chat.signalR {
    public interface IChatSessions {
        void AddSession(string connectionId, string userId);
        string? getConnectionId(string userId);
        string? getUserId(string connectionId);
        void RemoveSession(string connectionId, string? userId);
    }
}