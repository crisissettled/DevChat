using Chat.Model;
using Chat.Utils;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Caching.Memory;

namespace Chat.signalR {
    public class ChatHub : Hub<IChatClient> {

        private readonly IChatSessions _chatSessions;
        public ChatHub( IChatSessions chatSessions) {      
            _chatSessions = chatSessions;
        }

        public override Task OnConnectedAsync() {
            var UserId = this.Context.UserIdentifier;
            if (UserId != null) {        
                _chatSessions.AddSession(this.Context.ConnectionId, UserId);
            }

            return base.OnConnectedAsync();
        }

        //---- use [hubContext] in Controller instead ----
        //public Task SendMessage(string toUserId, string message) {          
        //    if(string.IsNullOrWhiteSpace(this.Context.UserIdentifier)) return Task.CompletedTask;
            
        //    try {
        //        return this.Clients.Users(toUserId).ReceiveMessage(this.Context.UserIdentifier, message);
        //    }
        //    catch (Exception ex) {
        //        return Task.FromException(ex);
        //    }            
        //}

        public override Task OnDisconnectedAsync(Exception? exception) {           
            _chatSessions.RemoveSession(this.Context.ConnectionId, this.Context.UserIdentifier);
            return base.OnDisconnectedAsync(exception);
        }
    }
}
