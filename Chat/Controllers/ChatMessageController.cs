using Chat.Model.Request;
using Chat.signalR;
using Chat.Utils;
using Chat.Utils.CustomAttribute;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Chat.Controllers {

    [Authorize]
    public class ChatMessageController : ApiControllerBase {

        private readonly bool IsDevelopment;
        private readonly IHubContext<ChatHub> _hubContext;
        private readonly IChatSessions _chatSessions;
        public ChatMessageController(IHostEnvironment env, IHubContext<ChatHub> hubContext, IChatSessions chatSessions) : base(env) {
            IsDevelopment = env.IsDevelopment();
            _hubContext = hubContext;
            _chatSessions = chatSessions;
        }


        [HttpPost]
        public async Task<ActionResult> SendMessage(ChatMessageRequest chatRequest) {

            var connectionId = _chatSessions.getConnectionId(chatRequest.toUserId);

            if (connectionId != null) {        
                await _hubContext.Clients.Client(connectionId).SendAsync("ReceiveMessage", chatRequest.message);
            }

            return Ok("");
        }
    }
}
