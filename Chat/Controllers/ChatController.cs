using Chat.Model.Request;
using Chat.signalR;
using Chat.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Chat.Controllers {

    public class ChatController : ApiControllerBase {

        private readonly bool IsDevelopment;
        private readonly IHubContext<ChatHub> _hubContext;
        private readonly IChatSessions _chatSessions;
        public ChatController(IHostEnvironment env, IHubContext<ChatHub> hubContext, IChatSessions chatSessions) : base(env) {
            IsDevelopment = env.IsDevelopment();
            _hubContext = hubContext;
            _chatSessions = chatSessions;
        }


        [HttpPost]
        public async Task<ActionResult> SendMessage(ChatRequest chatRequest) {

            var connectionId = _chatSessions.getConnectionId(chatRequest.toUserId);

            if (connectionId != null) {        
                await _hubContext.Clients.Client(connectionId).SendAsync("ReceiveMessage", chatRequest.message);
            }

            return Ok("");
        }
    }
}
