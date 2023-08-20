using Chat.Model.Response;
using Chat.Model.Response.Shared;
using FluentValidation.Results;
using Microsoft.AspNetCore.Mvc;

namespace Chat.Utils
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ApiControllerBase : ControllerBase {
        private readonly IHostEnvironment env;
        public ApiControllerBase(IHostEnvironment env) {
            this.env = env;
        }

        protected BadRequestObjectResult BadRequestResult(ResultCode code) {
            if (env.IsDevelopment()) {
                return BadRequest(new ResponseResult(code));
            }

            return BadRequest(code);
        }

        protected BadRequestObjectResult ValidationResult(ValidationResult result) {
            if (env.IsDevelopment()) {
                return BadRequest(result);
            }

            return BadRequest(result.Errors);
        }

        protected ObjectResult ExceptionResult(Exception ex, string? message = null) {
            if (env.IsDevelopment()) {
                return new ObjectResult(ex.ToString()) { StatusCode = StatusCodes.Status500InternalServerError };
            }

            return new ObjectResult(message ?? "Unexcepted error occurred!") { StatusCode = StatusCodes.Status500InternalServerError };
        }
    }
}
