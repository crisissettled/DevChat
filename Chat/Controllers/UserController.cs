﻿using Chat.Model;
using Chat.Model.ResponseResult;
using Chat.Utils;
using Chat.Utils.Crypto;
using Chat.Utils.MongoDb;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Mvc;

namespace Chat.Controllers {

    public class UserController : ApiControllerBase {

        private readonly IMongoDbUserService _mongoDbUserService;
        private readonly ICrypto _crypto;

        public UserController(IHostEnvironment env, IMongoDbUserService mongoDbUserService, ICrypto crypto) : base(env) {
            _mongoDbUserService = mongoDbUserService;
            _crypto = crypto;
        }

        [HttpPut]
        public async Task<IActionResult> SignUp([FromServices] IValidator<SignUpRequest> validator, SignUpRequest signUpRequest) {

            ValidationResult result = await validator.ValidateAsync(signUpRequest);

            if (!result.IsValid) {
                return ValidationResult(result);
            }

            if(await _mongoDbUserService.GetUserAsync(signUpRequest.UserId) == true) {
                return BadRequestResult(new InternalError(ResultCode.UserExisted));
            }

            var objUser = new User(signUpRequest.UserId, _crypto.SHA256Encrypt(signUpRequest.Password), signUpRequest.Name) {
                Email = signUpRequest.Email
            };

            try {
                await _mongoDbUserService.CreateUserAsync(objUser);
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
