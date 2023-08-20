using Chat.Model;
using Chat.Model.Request;
using Chat.Model.Response;
using Chat.Model.Response.Shared;
using Chat.Utils;
using Chat.Utils.MongoDb.UserFirendService;
using Chat.Utils.MongoDb.UserService;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace Chat.Controllers {

    public class UserFriendController : ApiControllerBase {


        private readonly IMongoDbUserFriendService _mongoDbUserFriendService;
        private readonly IMongoDbUserService _mongoDbUserService;

        public UserFriendController(IHostEnvironment env, 
            IMongoDbUserFriendService mongoDbUserFriendService,
            IMongoDbUserService mongoDbUserService
            ) : base(env) {
            _mongoDbUserFriendService = mongoDbUserFriendService;
            _mongoDbUserService = mongoDbUserService;
        }

        [HttpPut]
        public async Task<ActionResult<ResponseResult>> GetUserFriend(
            [FromServices] IValidator<UserFriendRequest> validator,
            UserFriendRequest userFriendRequest) {

            var resultValidate = await validator.ValidateAsync(userFriendRequest);
            if (!resultValidate.IsValid) {
                return ValidationResult(resultValidate);
            }

            var userFriendList = await _mongoDbUserFriendService.GetUserFriendList(userFriendRequest.UserId);
            if (userFriendList == null || userFriendList.Count == 0) {
                return new ResponseResult(ResultCode.NoDataFound);
            }


            var userFriendResponseList = new List<UserFriendResponse>();
            foreach (var userFriend in userFriendList) {
                if (userFriend.Blocked != userFriendRequest.Blocked) continue; // check blocked status with user request

                var user = await _mongoDbUserService.GetUserAsync(userFriend.FriendUserId);
                if (user != null) {
                    userFriendResponseList.Add(new UserFriendResponse(user.UserId, user.Name, user.Gender);
                }
            }

            var result = new ResponseResult(ResultCode.Success) {
                data = userFriendResponseList
            };

            return Ok(result);
        }
    }
}
