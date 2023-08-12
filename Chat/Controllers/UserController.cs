using Chat.Model;
using Chat.Utils;
using Chat.Utils.MongoDb;
using Microsoft.AspNetCore.Mvc;

namespace Chat.Controllers {
   
    public class UserController : ApiControllerBase {

        private readonly IMongoDbUserService _mongoDbUserService;

        public UserController(IMongoDbUserService mongoDbUserService) {
            _mongoDbUserService = mongoDbUserService;
        } 

        [HttpPut]
        public async Task<IActionResult> SignUp(SignUpRequest signUpRequest) {
            var objUser = new User(signUpRequest.UserId, signUpRequest.Password, signUpRequest.Name) {
                Email = signUpRequest.Email
            };

            await _mongoDbUserService.CreateAsync(objUser);

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
            return Ok($"Pong - {DateTime.Now.ToLocalTime()}" );
        }

    }
}
