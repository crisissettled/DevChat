using Chat.Model.Response;
using Chat.Model.Response.Shared;
using FluentValidation.Results;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Mvc;

namespace Chat.Utils {
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ApiControllerBase : ControllerBase {
        private readonly bool IsDevelopment;
        public ApiControllerBase(IHostEnvironment env) {
            IsDevelopment = env.IsDevelopment();
        }

        protected BadRequestObjectResult BadRequestResult(ResultCode code) {
            return BadRequest(new ResponseResult(code, IsDevelopment));
        }

        protected BadRequestObjectResult ValidationResult(ValidationResult result) {
            return BadRequest(new ResponseResult(ResultCode.ValidationFailed, IsDevelopment) { data = IsDevelopment == true ? result : result.Errors });
        }

        protected ObjectResult ExceptionResult(Exception ex) {
            return new ObjectResult(new ResponseResult(ResultCode.Error, IsDevelopment) { data = IsDevelopment ? ex : "" }) { StatusCode = StatusCodes.Status500InternalServerError };
        }
    }
}
