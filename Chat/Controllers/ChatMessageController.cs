using Chat.Model;
using Chat.Model.Request;
using Chat.Model.Response.Shared;
using Chat.signalR;
using Chat.Utils;
using Chat.Utils.CustomAttribute;
using Chat.Utils.MongoDb.ChatMessageService;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Chat.Controllers {

    [Authorize]
    public class ChatMessageController : ApiControllerBase {

        private readonly IHubContext<ChatHub> _hubContext;
        private readonly IChatSessions _chatSessions;
        private readonly IMongoDbChatMessageService _mongoDbChatMessageSerivce;
        public ChatMessageController(IHostEnvironment env,
            IHubContext<ChatHub> hubContext,
            IChatSessions chatSessions,
            IMongoDbChatMessageService mongoDbChatMessageService,
            IHttpContextAccessor httpContextAccessor) : base(env, httpContextAccessor) {
            _hubContext = hubContext;
            _chatSessions = chatSessions;
            _mongoDbChatMessageSerivce = mongoDbChatMessageService;
        }


        [HttpPost]
        public async Task<ActionResult> SendMessage(
            ChatMessageRequest chatRequest,
            [FromServices] IValidator<ChatMessageRequest> validator
            ) {

            var resultValidate = await validator.ValidateAsync(chatRequest);

            if (!resultValidate.IsValid) {
                return ValidationResult(resultValidate);
            }

            //TODO check if toUserId is friend of current user

            var connectionId = _chatSessions.getConnectionId(chatRequest.toUserId);

            var loggedInUserId = _httpContext?.Items["UserId"]?.ToString();
            if (loggedInUserId != null) {
                var chatMessage = new ChatMessage(loggedInUserId, chatRequest.toUserId, chatRequest.message);
                var savedChatMessage = await _mongoDbChatMessageSerivce.AddChatMessage(chatMessage);

                if (connectionId != null) {
                    await _hubContext.Clients.Client(connectionId).SendAsync("ReceiveMessage", loggedInUserId, chatRequest.message);
                }

                return Ok(new ResponseResult(ResultCode.Success, _isDevelopment) { data = savedChatMessage });

            } else {
                return Ok(new ResponseResult(ResultCode.Failed, _isDevelopment) { message = "Invalid user, please re-login" });
            }
        }
    }
}
