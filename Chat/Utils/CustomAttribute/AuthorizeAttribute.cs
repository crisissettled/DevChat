using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;

namespace Chat.Utils.CustomAttribute {
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class AuthorizeAttribute : Attribute, IAuthorizationFilter {
        public void OnAuthorization(AuthorizationFilterContext context) {
            var user = context.HttpContext.Items["UserId"];
            if (user == null) {
                // user not logged in
                context.Result = new JsonResult(new {
                    message = "Unauthorized"
                }) {
                    StatusCode = StatusCodes.Status401Unauthorized
                };
            }
        }
    }
}
