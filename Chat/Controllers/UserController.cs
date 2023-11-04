using Chat.Model;
using Chat.Model.Request;
using Chat.Model.Response;
using Chat.Model.Response.Shared;
using Chat.Utils;
using Chat.Utils.Crypto;
using Chat.Utils.CustomAttribute;
using Chat.Utils.MongoDb.UserService;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;


namespace Chat.Controllers {

    public class UserController : ApiControllerBase {
        private readonly bool IsDevelopment;
        private readonly IMongoDbUserService _mongoDbUserService;
        private readonly IMongoDbUserSessionStateService _mongoDbUserSessionStateService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserController(IHostEnvironment env,
            IMongoDbUserService mongoDbUserService,
            IMongoDbUserSessionStateService mongoDbUserSessionStateService,
            IHttpContextAccessor httpContextAccessor) : base(env) {
            IsDevelopment = env.IsDevelopment();
            _mongoDbUserService = mongoDbUserService;
            _mongoDbUserSessionStateService = mongoDbUserSessionStateService;
            _httpContextAccessor = httpContextAccessor;
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


        [HttpGet]
        [Authorize]
        public async Task<ActionResult> GetUserInfo(string userId) {
            var user = await _mongoDbUserService.GetUserAsync(userId);
            var userResponse = new UserResponse(user.UserId) {
                Name = user.Name,
                Gender = user.Gender,
                Phone = user.Phone,
                Email = user.Email,
                Province    = user.Province,
                City = user.City,
                Address = user.Address,
            };

            return Ok(new ResponseResult(ResultCode.Success, IsDevelopment) { data = userResponse });
        }
        [HttpPut]
        [Authorize]
        public async Task<ActionResult> UpdateUserInfo(
        [FromServices] IValidator<UpdateUserInfoRequest> validator,
        [FromServices] ICrypto crypto,
        UpdateUserInfoRequest updateUserInfoRequest) {

            if (updateUserInfoRequest == null) return BadRequest(new ResponseResult(ResultCode.BadDataRequest, IsDevelopment));

            var resultValidate = await validator.ValidateAsync(updateUserInfoRequest);
            if (!resultValidate.IsValid) {
                return ValidationResult(resultValidate);
            }

            if (!string.IsNullOrEmpty(updateUserInfoRequest.Password) && !string.IsNullOrEmpty(updateUserInfoRequest.NewPassword)) {
                var currentUser = await _mongoDbUserService.GetUserAsync(updateUserInfoRequest.UserId);
                if (currentUser == null || currentUser.Password != crypto.SHA256Encrypt(updateUserInfoRequest.Password)) {
                    return BadRequestResult(ResultCode.NoDataFound);
                }
            }

            var newUser = new User(
                    updateUserInfoRequest.UserId,
                    string.IsNullOrEmpty(updateUserInfoRequest.Password) == true || string.IsNullOrEmpty(updateUserInfoRequest.NewPassword) == true ? "" : crypto.SHA256Encrypt(updateUserInfoRequest.NewPassword),
                    updateUserInfoRequest.Name) {
                Gender = updateUserInfoRequest.Gender,
                Province = updateUserInfoRequest.Province,
                City = updateUserInfoRequest.City,
                Address = updateUserInfoRequest.Address,
                Phone = updateUserInfoRequest.Phone,
                Email = updateUserInfoRequest.Email
            };

            await _mongoDbUserService.UpdateUserAsync(newUser);

            var user = await _mongoDbUserService.GetUserAsync(updateUserInfoRequest.UserId);
            var userResponse = new UserResponse(user.UserId) {
                Name = user.Name,
                Gender = user.Gender,
                Phone = user.Phone,
                Email = user.Email,
                Province = user.Province,
                City = user.City,
                Address = user.Address,
            };

            return Ok(new ResponseResult(ResultCode.Success, IsDevelopment) { data = userResponse });
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
            var refreshToken = Jwt.GenerateRefreshToken(signInRequest.UserId);

            var userSessionState = new UserSessionState(signInRequest.UserId, token, refreshToken) { KeepLoggedIn = signInRequest.KeepLoggedIn };
            await _mongoDbUserSessionStateService.UpsertUserSessionState(userSessionState);

            CookieOptions options = new CookieOptions();
            options.HttpOnly = true;
            options.SameSite = SameSiteMode.Strict;
            if (signInRequest.KeepLoggedIn == true) options.Expires = DateTime.Now.AddDays(Constants.SESSION_KEEP_LOGGED_IN_DAYS); // 30 days keep logged in
            _httpContextAccessor.HttpContext!.Response.Cookies.Append(Constants.SESSION_COOKIE_KEY, refreshToken, options);

            return Ok(new ResponseResult(ResultCode.Success, IsDevelopment) { data = new { token, user.UserId } });
        }


        [HttpPut]
        public async Task<ActionResult> RefreshSignIn() {
            var curRefreshToken = _httpContextAccessor.HttpContext!.Request.Cookies[Constants.SESSION_COOKIE_KEY];
            if (curRefreshToken == null) return Unauthorized(new ResponseResult(ResultCode.UnAutherized, IsDevelopment));

            var curUserSessionState = await _mongoDbUserSessionStateService.GetUserSessionState(curRefreshToken);
            if (curUserSessionState == null) return Unauthorized(new ResponseResult(ResultCode.UnAutherized, IsDevelopment));

            if (curUserSessionState.UserId != null && curRefreshToken.Substring(0, curUserSessionState.UserId.Length) == curUserSessionState.UserId && curUserSessionState.IsSignedOut == false) {
                var token = Jwt.GenerateAccessToken(curUserSessionState.UserId);

                //update every [SESSION_COOKIE_UPDATE_INTERVAL_IN_SECONDS] seconds, to avoid confilcts more than requests at the same time
                var booUpdateRefreshToken = curUserSessionState.UpdatedAt.AddSeconds(Constants.SESSION_COOKIE_UPDATE_INTERVAL_IN_SECONDS) < DateTime.Now;

                var refreshToken = curRefreshToken;
                if (booUpdateRefreshToken == true) {
                    Jwt.GenerateRefreshToken(curUserSessionState.UserId);
                }

                var newUserSessionState = new UserSessionState(curUserSessionState.UserId, token, refreshToken) { KeepLoggedIn = curUserSessionState.KeepLoggedIn };
                await _mongoDbUserSessionStateService.UpsertUserSessionState(newUserSessionState);

                CookieOptions options = new CookieOptions();
                options.HttpOnly = true;
                options.SameSite = SameSiteMode.Strict;
                if (curUserSessionState.KeepLoggedIn == true) options.Expires = DateTime.Now.AddDays(Constants.SESSION_KEEP_LOGGED_IN_DAYS); // 30 days keep logged in
                _httpContextAccessor.HttpContext!.Response.Cookies.Append(Constants.SESSION_COOKIE_KEY, refreshToken, options);

                return Ok(new ResponseResult(ResultCode.Success, IsDevelopment) { data = new { token, curUserSessionState.UserId } });
            }

            return Unauthorized(new ResponseResult(ResultCode.UnAutherized, IsDevelopment));
        }

        [HttpPut]
        [Authorize]
        public async Task<ActionResult> SignChatOut() {
            var curRefreshToken = _httpContextAccessor.HttpContext!.Request.Cookies[Constants.SESSION_COOKIE_KEY];
            if (curRefreshToken != null) {
                var curUserSessionState = await _mongoDbUserSessionStateService.GetUserSessionState(curRefreshToken);
                await _mongoDbUserSessionStateService.UpdateSignOut(curUserSessionState.UserId, true);

                CookieOptions options = new CookieOptions();
                options.Expires = DateTime.Now.AddDays(-100);
                _httpContextAccessor.HttpContext!.Response.Cookies.Append(Constants.SESSION_COOKIE_KEY, "", options);
            }

            return Ok(new ResponseResult(ResultCode.Success, IsDevelopment));
        }


        [HttpPut]
        [Authorize]
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
