using Chat.Model;
using Chat.Model.Request;
using Chat.Model.Response;
using Chat.Model.Response.Shared;
using Chat.Utils;
using Chat.Utils.Crypto;
using Chat.Utils.MongoDb.UserService;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;


namespace Chat.Controllers {

    public class UserController : ApiControllerBase {

        private readonly IMongoDbUserService _mongoDbUserService;
        private readonly bool IsDevelopment;

        public UserController(IHostEnvironment env, IMongoDbUserService mongoDbUserService) : base(env) {
            _mongoDbUserService = mongoDbUserService;
            IsDevelopment = env.IsDevelopment();
        }

        [HttpPut]
        public async Task<ActionResult> SignUp(
            [FromServices] IValidator<SignUpRequest> validator,
            [FromServices] ICrypto crypto,
            SignUpRequest signUpRequest) {

            var resultValidate = await validator.ValidateAsync(signUpRequest);

            if (!resultValidate.IsValid) {
                return ValidationResult(resultValidate);
            }

            if (await _mongoDbUserService.GetUserAsync(signUpRequest.UserId) != null) {
                return BadRequestResult(ResultCode.UserExisted);
            }

            var objUser = new User(signUpRequest.UserId, crypto.SHA256Encrypt(signUpRequest.Password), signUpRequest.Name);

            try {
                await _mongoDbUserService.CreateUserAsync(objUser);
            } catch (Exception ex) {
                return ExceptionResult(ex);
            }

            return Ok(new ResponseResult(ResultCode.Success, IsDevelopment));
        }

        [HttpPut]
        public async Task<ActionResult> UpdateProfile(
            [FromServices] IValidator<UpdateProfileRequest> validator,
            [FromServices] ICrypto crypto,
            UpdateProfileRequest updateProfileRequest) {

            var resultValidate = await validator.ValidateAsync(updateProfileRequest);
            if (!resultValidate.IsValid) {
                return ValidationResult(resultValidate);
            }

            if (!string.IsNullOrEmpty(updateProfileRequest.Password) && !string.IsNullOrEmpty(updateProfileRequest.NewPassword)) {
                var currentUser = await _mongoDbUserService.GetUserAsync(updateProfileRequest.UserId);
                if (currentUser == null || currentUser.Password != crypto.SHA256Encrypt(updateProfileRequest.Password)) {
                    return BadRequestResult(ResultCode.NoDataFound);
                }
            }

            var newUser = new User(
                    updateProfileRequest.UserId,
                    string.IsNullOrEmpty(updateProfileRequest.Password) == true ? "" : crypto.SHA256Encrypt(updateProfileRequest.NewPassword),
                    updateProfileRequest.Name) {
                Gender = updateProfileRequest.Gender,
                Province = updateProfileRequest.Province,
                City = updateProfileRequest.City,
                Address = updateProfileRequest.Address,
                Phone = updateProfileRequest.Phone,
                Email = updateProfileRequest.Email
            };

            await _mongoDbUserService.UpdateUserAsync(newUser);


            return Ok(new ResponseResult(ResultCode.Success, IsDevelopment));
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
            if (user == null || user.Password != crypto.SHA256Encrypt(signInRequest.Password)) return Unauthorized(new ResponseResult(ResultCode.Failed, IsDevelopment));

            var token = Jwt.GenerateAccessToken(signInRequest.UserId);
            return Ok(new ResponseResult(ResultCode.Success, IsDevelopment) { data = token });
        }

        [HttpPut]
        public async Task<ActionResult> SearchFriend(SearchFriendRequest searchFriendRequest) {

            var userList = await _mongoDbUserService.GetUserListByKeywordAsync(searchFriendRequest.SearchKeyword);

            if (userList == null || userList.Count == 0) {
                return Ok(new ResponseResult(ResultCode.NoDataFound));
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
