using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Caching.Memory;

namespace Chat.signalR {
    public class ChatHub : Hub<IChatClient> {

        private const string cst_UnknowUser = "Unknown user";

        private readonly IMemoryCache _memoryCache;
        public ChatHub(IMemoryCache memoryCache) {
            _memoryCache = memoryCache;
        }

        public override Task OnConnectedAsync() {
            return base.OnConnectedAsync();
        }
        public Task SendMessage(string toUserId, string message) {
            var fromUser = cst_UnknowUser;

            if (_memoryCache.TryGetValue(this.Context.ConnectionId, out fromUser) == false) {
                fromUser = this.Context.User?.Identity?.Name ?? cst_UnknowUser;
                _memoryCache.Set(this.Context.ConnectionId, fromUser);
            }

            return this.Clients.Users(toUserId).ReceiveMessage(fromUser ?? cst_UnknowUser, message);
        }

        public override Task OnDisconnectedAsync(Exception? exception) {
            return base.OnDisconnectedAsync(exception);
        }
    }
}
