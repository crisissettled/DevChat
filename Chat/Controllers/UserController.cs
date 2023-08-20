using Chat.Model;
using Chat.Model.Request;
using Chat.Model.Response;
using Chat.Model.Response.Shared;
using Chat.Utils;
using Chat.Utils.Crypto;
using Chat.Utils.MongoDb.UserService;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;


namespace Chat.Controllers
{

    public class UserController : ApiControllerBase {

        private readonly IMongoDbUserService _mongoDbUserService;

        public UserController(IHostEnvironment env, IMongoDbUserService mongoDbUserService) : base(env) {
            _mongoDbUserService = mongoDbUserService;           
        }

        [HttpPut]
        public async Task<IActionResult> SignUp(
            [FromServices] IValidator<SignupRequest> validator,
            [FromServices] ICrypto crypto,
            SignupRequest signUpRequest) {

            var result = await validator.ValidateAsync(signUpRequest);

            if (!result.IsValid) {
                return ValidationResult(result);
            }

            if(await _mongoDbUserService.GetUserAsync(signUpRequest.UserId) != null) {
                return BadRequestResult(new InternalError(ResultCode.UserExisted));
            }

            var objUser = new User(signUpRequest.UserId, crypto.SHA256Encrypt(signUpRequest.Password), signUpRequest.Name);

            try {
                await _mongoDbUserService.CreateUserAsync(objUser);
            } catch (Exception ex) {
                return ExceptionResult(ex);
            }

            return Ok();
        }

        [HttpPut]
        public async Task<ActionResult> SignIn(
            [FromServices] IValidator<SignInRequest> validator,
            [FromServices] ICrypto crypto,
            SignInRequest signInRequest) {

            var result = await validator.ValidateAsync(signInRequest);

            if (!result.IsValid) {
                return ValidationResult(result);
            }

            var user = await _mongoDbUserService.GetUserAsync(signInRequest.UserId);
            if(user == null || user.Password != crypto.SHA256Encrypt(signInRequest.Password)) return Unauthorized();

            var token = Jwt.GenerateAccessToken(signInRequest.UserId);
            return Ok(token);
        }
        
        [HttpPut]
        public async Task<ActionResult<ResponseResult>> SearchFriend(SearchFriendRequest searchFriendRequest) {

            var userList = await _mongoDbUserService.GetUserListByKeywordAsync(searchFriendRequest.SearchKeyword);

            if(userList == null || userList.Count == 0) {
                return new ResponseResult(ResultCode.NoDataFound);
            }

            var result = new ResponseResult(ResultCode.Success) {
                data = userList.Select(x => new SearchFriendResponse(x.UserId, x.Name, x.Gender))
            };

            return Ok(result);
        }

        [HttpGet]
        public ActionResult<string> Ping() {
            return Ok($"Pong - {DateTime.Now.ToLocalTime()}");
        }

    }
}
