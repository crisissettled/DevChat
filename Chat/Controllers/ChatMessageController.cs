using Chat.Model;
using Chat.Model.Request;
using Chat.Model.Response;
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


        [HttpGet]
        public async Task<ActionResult> GetUserChatMessage() {
            if (_loggedInUserId != null) {
                var chatMessages = await _mongoDbChatMessageSerivce.GetUserChatMessages(_loggedInUserId);

                return Ok(new ResponseResult(ResultCode.Success, _isDevelopment) {
                    data = chatMessages.Select(x => new ChatMessageResponse(x.Id ?? "", x.FromUserId, x.ToUserId, x.Message, x.SendAt.ToString(), x.IsRead, x.IsSent))
                });
            }

            return Ok(new ResponseResult(ResultCode.Failed, _isDevelopment));
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

            if (_loggedInUserId != null) {
                var chatMessage = new ChatMessage(_loggedInUserId, chatRequest.toUserId, chatRequest.message);
                var savedChatMessage = await _mongoDbChatMessageSerivce.AddChatMessage(chatMessage);

                if (connectionId != null) {
                    await _hubContext.Clients.Client(connectionId).SendAsync("ReceiveMessage", savedChatMessage.Id, _loggedInUserId, chatRequest.message, savedChatMessage.SendAt.ToString(), savedChatMessage.IsSent);
                }
                if (savedChatMessage != null) {
                    return Ok(new ResponseResult(ResultCode.Success, _isDevelopment) {
                        data = new ChatMessageResponse(savedChatMessage.Id ?? "", savedChatMessage.FromUserId, savedChatMessage.ToUserId, savedChatMessage.Message, savedChatMessage.SendAt.ToString(), savedChatMessage.IsRead, savedChatMessage.IsSent)
                    });
                } else {
                    return Ok(new ResponseResult(ResultCode.Failed, _isDevelopment) { message = "Save message failed" });
                }
            } else {
                return Ok(new ResponseResult(ResultCode.Failed, _isDevelopment) { message = "Invalid user, please re-login" });
            }
        }


        [HttpPut]
        public async Task<ActionResult> UpdateMessageReadStatus(
          ChatMessageUpdateReadStatusRequest chatMessageUpdateReadStatusRequest,
          [FromServices] IValidator<ChatMessageUpdateReadStatusRequest> validator
          ) {

            var resultValidate = await validator.ValidateAsync(chatMessageUpdateReadStatusRequest);

            if (!resultValidate.IsValid) {
                return ValidationResult(resultValidate);
            }

            var chatMessage = await _mongoDbChatMessageSerivce.GetChatMessagesById(chatMessageUpdateReadStatusRequest.id);
            if (_loggedInUserId!=null && chatMessage != null && chatMessage.IsRead == false && chatMessage.ToUserId == _loggedInUserId) {

                var updatedChatMessage = await _mongoDbChatMessageSerivce.UpdateChatMessageIsRead(chatMessageUpdateReadStatusRequest.id);

                var connectionId = _chatSessions.getConnectionId(chatMessage.FromUserId);
                if (connectionId != null) {
                    await _hubContext.Clients.Client(connectionId).SendAsync("MessageRead", updatedChatMessage.Id, updatedChatMessage.FromUserId, updatedChatMessage.ToUserId, updatedChatMessage.Message, updatedChatMessage.SendAt.ToString(), updatedChatMessage.IsSent, updatedChatMessage.IsRead);
                }

                return Ok(new ResponseResult(ResultCode.Success, _isDevelopment) {
                    data = new ChatMessageResponse(updatedChatMessage.Id ?? "", updatedChatMessage.FromUserId, updatedChatMessage.ToUserId, updatedChatMessage.Message, updatedChatMessage.SendAt.ToString(), updatedChatMessage.IsRead, updatedChatMessage.IsSent)
                });

            }

            return Ok(new ResponseResult(ResultCode.Failed, _isDevelopment) { message = "update message read status failed" }); 
        }

    }
}
