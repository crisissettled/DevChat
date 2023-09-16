using Chat.Utils;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Caching.Memory;

namespace Chat.signalR {
    public class ChatHub : Hub<IChatClient> {

        private readonly IMemoryCache _memoryCache;
        public ChatHub(IMemoryCache memoryCache) {
            _memoryCache = memoryCache;
        }

        public override Task OnConnectedAsync() {
            var UserId = this.Context.UserIdentifier;
            if (UserId != null) {
                _memoryCache.Set<string>(this.Context.ConnectionId, UserId);
            }

            return base.OnConnectedAsync();
        }
        public Task SendMessage(string toUserId, string message) {
            if (_memoryCache.TryGetValue(this.Context.ConnectionId, out string? fromUserId) == false) {
                Console.WriteLine("From user is not existing in cache");
            }

            if (fromUserId == null) return Task.CompletedTask;

            return this.Clients.Users(toUserId).ReceiveMessage(fromUserId, message);
        }

        public override Task OnDisconnectedAsync(Exception? exception) {
            _memoryCache.Remove(this.Context.ConnectionId);
            return base.OnDisconnectedAsync(exception);
        }
    }
}
