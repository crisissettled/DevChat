using Chat.Model.Response;
using Chat.Model.Response.Shared;
using FluentValidation.Results;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Mvc;

namespace Chat.Utils {
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ApiControllerBase : ControllerBase {
        protected readonly bool _isDevelopment;
        protected HttpContext? _httpContext;
        public ApiControllerBase(IHostEnvironment env, IHttpContextAccessor httpContextAccessor) {
            _isDevelopment = env.IsDevelopment();
            _httpContext = httpContextAccessor?.HttpContext;
        }

        protected BadRequestObjectResult BadRequestResult(ResultCode code) {
            return BadRequest(new ResponseResult(code, _isDevelopment));
        }

        protected BadRequestObjectResult ValidationResult(ValidationResult result) {
            return BadRequest(new ResponseResult(ResultCode.ValidationFailed, _isDevelopment) { data = _isDevelopment == true ? result : result.Errors });
        }

        protected ObjectResult ExceptionResult(Exception ex) {
            return new ObjectResult(new ResponseResult(ResultCode.Error, _isDevelopment) { data = _isDevelopment ? ex : "" }) { StatusCode = StatusCodes.Status500InternalServerError };
        }
    }
}
