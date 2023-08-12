using Chat.Utils;
using Microsoft.AspNetCore.Mvc;

namespace Chat.Controllers {
   
    public class UserController : ApiControllerBase {

        [HttpPut]
        public IActionResult SignUp(string UserId,string Password) {
            return Ok();
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
