namespace Chat.signalR {

    public class ChatSessions : IChatSessions {
        private Dictionary<string, string> connectionId_userId;

        private Dictionary<string, string> userId_connectionId;

        public ChatSessions() {
            connectionId_userId = new Dictionary<string, string>();
            userId_connectionId = new Dictionary<string, string>();

        }

        public void AddSession(string connectionId, string userId) {
            if (connectionId_userId.ContainsKey(connectionId)) {
                connectionId_userId[connectionId] = userId;
            } else {
                connectionId_userId.Add(connectionId, userId);
            }


            if (userId_connectionId.ContainsKey(userId)) {
                userId_connectionId[userId] = connectionId;
            } else {
                userId_connectionId.Add(userId, connectionId);
            }
        }

        public void RemoveSession(string connectionId, string? userId) {
            connectionId_userId.Remove(connectionId);
            if (string.IsNullOrWhiteSpace(userId) == false) userId_connectionId.Remove(userId);
        }


        public string? getUserId(string connectionId) {
            if(connectionId_userId.ContainsKey(connectionId)) return connectionId_userId[connectionId];
            return null;
        }


        public string? getConnectionId(string userId) {
            if(userId_connectionId.ContainsKey(userId)) return userId_connectionId[userId];
            return null;
        }

    }
}
