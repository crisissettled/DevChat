using Chat.Model;
using Chat.Utils;
using Chat.Utils.MongoDb;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Mvc;

namespace Chat.Controllers {

    public class UserController : ApiControllerBase {

        private readonly IMongoDbUserService _mongoDbUserService;  

        public UserController(IHostEnvironment env, IMongoDbUserService mongoDbUserService) : base(env) {
            _mongoDbUserService = mongoDbUserService;
        }

        [HttpPut]
        public async Task<IActionResult> SignUp([FromServices] IValidator<SignUpRequest> validator, SignUpRequest signUpRequest) {

            ValidationResult result = await validator.ValidateAsync(signUpRequest);

            if (!result.IsValid) {
                return ValidationResult(result);
            }

            var objUser = new User(signUpRequest.UserId, signUpRequest.Password, signUpRequest.Name) {
                Email = signUpRequest.Email
            };

            try {
                await _mongoDbUserService.CreateAsync(objUser);
            } catch (Exception ex) {
                return ExceptionResult(ex);
            }

            return Ok();
        }

        [HttpPut]
        public ActionResult SignIn(SignInRequest signInReq) {
            if (signInReq.UserId != "admin" || signInReq.Password != "abc") return Unauthorized();

            var token = Jwt.GenerateAccessToken(signInReq.UserId);
            return Ok(token);
        }

        [HttpPut]
        public ActionResult<string> Friends(string UserId) {

            return Ok("Ok");
        }

        [HttpPut]
        public ActionResult<string> SearchFriend(string UserInfo) {

            return Ok("Ok");
        }

        [HttpGet]
        public ActionResult<string> Ping() {
            return Ok($"Pong - {DateTime.Now.ToLocalTime()}");
        }

    }
}
