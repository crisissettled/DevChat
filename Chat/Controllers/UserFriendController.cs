using Chat.Model;
using Chat.Model.Request;
using Chat.Model.Response;
using Chat.Model.Response.Shared;
using Chat.signalR;
using Chat.Utils;
using Chat.Utils.CustomAttribute;
using Chat.Utils.MongoDb.UserFirendService;
using Chat.Utils.MongoDb.UserService;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Chat.Controllers {

    [Authorize]
    public class UserFriendController : ApiControllerBase {
        private readonly IMongoDbUserFriendService _mongoDbUserFriendService;
        private readonly IMongoDbUserService _mongoDbUserService;
        private readonly IHubContext<ChatHub> _hubContext;
        private readonly IChatSessions _chatSessions;


        public UserFriendController(IHostEnvironment env,
            IMongoDbUserFriendService mongoDbUserFriendService,
            IMongoDbUserService mongoDbUserService,
            IHubContext<ChatHub> hubContext,
            IChatSessions chatSessions,
            IHttpContextAccessor httpContextAccessor) : base(env, httpContextAccessor) {
            _mongoDbUserFriendService = mongoDbUserFriendService;
            _mongoDbUserService = mongoDbUserService;
            _hubContext = hubContext;
            _chatSessions = chatSessions;
        }

        [HttpPut]
        public async Task<ActionResult<ResponseResult>> GetUserFriends(
            [FromServices] IValidator<GetUserFriendsRequest> validator,
            GetUserFriendsRequest userFriendRequest) {

            var resultValidate = await validator.ValidateAsync(userFriendRequest);
            if (!resultValidate.IsValid) {
                return ValidationResult(resultValidate);
            }

            if (userFriendRequest == null) return BadRequest(new ResponseResult(ResultCode.BadDataRequest, _isDevelopment));

            var userFriendResponseList = await GetUserFriend(userFriendRequest.UserId, userFriendRequest.Blocked);
            var result = new ResponseResult(ResultCode.Success, _isDevelopment) {
                data = userFriendResponseList
            };

            return Ok(result);
        }


        [HttpPost]
        public async Task<ActionResult<ResponseResult>> AddUserFriend(
            [FromServices] IValidator<AddUserFriendRequest> validator,
            AddUserFriendRequest addUserFriendRequest) {

            var resultValidate = await validator.ValidateAsync(addUserFriendRequest);
            if (!resultValidate.IsValid) {
                return ValidationResult(resultValidate);
            }

            try {
                var userFriendList = await _mongoDbUserFriendService.GetUserFriendList(addUserFriendRequest.UserId);
                if (userFriendList != null && userFriendList.Any(x => x.FriendUserId == addUserFriendRequest.FriendUserId)) {
                    return BadRequestResult(ResultCode.UserFriendExisted);
                }

                //verify UserId, FriendUserId are valid
                var fromUser = _mongoDbUserService.GetUserAsync(addUserFriendRequest.UserId);
                var toUser = _mongoDbUserService.GetUserAsync(addUserFriendRequest.FriendUserId);

                var users = await Task.WhenAll(fromUser, toUser);
                if (users.Any(x => x == null)) {
                    return BadRequestResult(ResultCode.UserNotFound);
                }

                var userFriend = new UserFriend(addUserFriendRequest.UserId, addUserFriendRequest.FriendUserId) {
                    MessageOut = new List<UserFriendMessage>() { new UserFriendMessage() { Message = addUserFriendRequest.message ?? Constants.USER_REQUEST_TEXT } }
                };

                await _mongoDbUserFriendService.AddUserFriend(userFriend);

                var userFriendResponseList = await GetUserFriend(addUserFriendRequest.UserId, null);
                var result = new ResponseResult(ResultCode.Success, _isDevelopment) {
                    data = userFriendResponseList
                };


                var connectionId = _chatSessions.getConnectionId(addUserFriendRequest.FriendUserId);

                if (connectionId != null) {
                    await _hubContext.Clients.Client(connectionId).SendAsync("FriendRequestNotification", "Friend Request Notification");
                }


                return Ok(result);

            } catch (Exception ex) {
                return ExceptionResult(ex);
            }
        }

        [HttpPost]
        public async Task<ActionResult<ResponseResult>> AddUserFriendMessage(
            [FromServices] IValidator<AddUserFriendMessageRequest> validator,
            AddUserFriendMessageRequest addUserFriendMessageRequest) {

            var resultValidate = await validator.ValidateAsync(addUserFriendMessageRequest);
            if (!resultValidate.IsValid) {
                return ValidationResult(resultValidate);
            }

            var userFriendList = await _mongoDbUserFriendService.GetUserFriendList(addUserFriendMessageRequest.UserId);
            if (userFriendList == null || userFriendList.Any(x => x.FriendUserId == addUserFriendMessageRequest.FriendUserId) == false) {
                return BadRequestResult(ResultCode.UserFriendExisted);
            }

            await _mongoDbUserFriendService.UpdateUserFriendMessage(
                addUserFriendMessageRequest.UserId,
                addUserFriendMessageRequest.FriendUserId,
                new UserFriendMessage() { Message = addUserFriendMessageRequest.Message },
                addUserFriendMessageRequest.MessageType);


            return Ok(new ResponseResult(ResultCode.Success, _isDevelopment));

        }

        [HttpPut]
        public async Task<ActionResult> AcceptOrDenyFriend(
            AcceptOrDenyFriendRequest acceptOrDenyFriendRequest,
            [FromServices] IValidator<AcceptOrDenyFriendRequest> validator) {
            var resultValidate = await validator.ValidateAsync(acceptOrDenyFriendRequest);
            if (!resultValidate.IsValid) {
                return ValidationResult(resultValidate);
            }

            await _mongoDbUserFriendService.AcceptOrDenyFriend(
                acceptOrDenyFriendRequest.UserId,
                acceptOrDenyFriendRequest.FriendUserId,
                acceptOrDenyFriendRequest.AcceptOrDeny
                );

            var userFriendResponseList = await GetUserFriend(acceptOrDenyFriendRequest.UserId);
            var result = new ResponseResult(ResultCode.Success, _isDevelopment) {
                data = userFriendResponseList
            };

            var connectionId = _chatSessions.getConnectionId(acceptOrDenyFriendRequest.FriendUserId);

            if (connectionId != null) {
                await _hubContext.Clients.Client(connectionId).SendAsync("FriendRequestAcceptOrDenyNotification", $"Friend Request {acceptOrDenyFriendRequest.AcceptOrDeny}");
            }

            return Ok(result);
        }



        private async Task<List<UserFriendResponse>> GetUserFriend(string UserId, bool? Blocked = null) {

            var userFriendResponseList = new List<UserFriendResponse>();

            var userFriendList = await _mongoDbUserFriendService.GetUserFriendList(UserId);
            if (userFriendList == null || userFriendList.Count == 0) {
                return userFriendResponseList;
            }


            foreach (var userFriend in userFriendList) {
                if (Blocked != null && userFriend.Blocked != null && userFriend.Blocked != Blocked) continue; // check blocked status with user request

                var user = await _mongoDbUserService.GetUserAsync(UserId == userFriend.FriendUserId ? userFriend.UserId : userFriend.FriendUserId);
                if (user != null) {
                    userFriendResponseList.Add(new UserFriendResponse(user.UserId, user.Name, userFriend.FriendUserId, user.Gender, userFriend.FriendStatus, userFriend.Blocked));
                }
            }

            return userFriendResponseList;
        }
    }
}
