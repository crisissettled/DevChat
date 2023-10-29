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
        private readonly IMongoDbLogInStateService _mongoDbLoginStateService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserController(IHostEnvironment env,
            IMongoDbUserService mongoDbUserService,
            IMongoDbLogInStateService mongoDbLoginStateService,
            IHttpContextAccessor httpContextAccessor) : base(env) {
            IsDevelopment = env.IsDevelopment();
            _mongoDbUserService = mongoDbUserService;
            _mongoDbLoginStateService = mongoDbLoginStateService;
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

        [HttpPut]
        [Authorize]
        public async Task<ActionResult> UpdateProfile(
            [FromServices] IValidator<UpdateProfileRequest> validator,
            [FromServices] ICrypto crypto,
            UpdateProfileRequest updateProfileRequest) {

            if (updateProfileRequest == null) return BadRequest(new ResponseResult(ResultCode.BadDataRequest, IsDevelopment));

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
                    string.IsNullOrEmpty(updateProfileRequest.Password) == true || string.IsNullOrEmpty(updateProfileRequest.NewPassword) == true ? "" : crypto.SHA256Encrypt(updateProfileRequest.NewPassword),
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
            var refreshToken = Jwt.GenerateRefreshToken(signInRequest.UserId);

            var logInState = new LogInState(signInRequest.UserId, token, refreshToken) { KeepLoggedIn = signInRequest.KeepLoggedIn };
            await _mongoDbLoginStateService.UpsertLoginState(logInState);

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

            var curLogInState = await _mongoDbLoginStateService.GetLogInState(curRefreshToken);
            if (curLogInState == null) return Unauthorized(new ResponseResult(ResultCode.UnAutherized, IsDevelopment));

            if (curLogInState.UserId != null && curRefreshToken.Substring(0, curLogInState.UserId.Length) == curLogInState.UserId && curLogInState.IsSignedOut == false) {
                var token = Jwt.GenerateAccessToken(curLogInState.UserId);

                //update every [SESSION_COOKIE_UPDATE_INTERVAL_IN_SECONDS] seconds, to avoid confilcts more than requests at the same time
                var booUpdateRefreshToken = curLogInState.UpdatedAt.AddSeconds(Constants.SESSION_COOKIE_UPDATE_INTERVAL_IN_SECONDS) < DateTime.Now;

                var refreshToken = curRefreshToken;
                if (booUpdateRefreshToken == true) {
                    Jwt.GenerateRefreshToken(curLogInState.UserId);
                }

                var newLogInState = new LogInState(curLogInState.UserId, token, refreshToken) { KeepLoggedIn = curLogInState.KeepLoggedIn };
                await _mongoDbLoginStateService.UpsertLoginState(newLogInState);

                CookieOptions options = new CookieOptions();
                options.HttpOnly = true;
                options.SameSite = SameSiteMode.Strict;
                if (curLogInState.KeepLoggedIn == true) options.Expires = DateTime.Now.AddDays(Constants.SESSION_KEEP_LOGGED_IN_DAYS); // 30 days keep logged in
                _httpContextAccessor.HttpContext!.Response.Cookies.Append(Constants.SESSION_COOKIE_KEY, refreshToken, options);

                return Ok(new ResponseResult(ResultCode.Success, IsDevelopment) { data = new { token, curLogInState.UserId } });
            }

            return Unauthorized(new ResponseResult(ResultCode.UnAutherized, IsDevelopment));
        }

        [HttpPut]
        [Authorize]
        public async Task<ActionResult> SignChatOut() {
            var curRefreshToken = _httpContextAccessor.HttpContext!.Request.Cookies[Constants.SESSION_COOKIE_KEY];
            if (curRefreshToken != null) {
                var curLogInState = await _mongoDbLoginStateService.GetLogInState(curRefreshToken);
                await _mongoDbLoginStateService.UpdateSignOut(curLogInState.UserId, true);

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
