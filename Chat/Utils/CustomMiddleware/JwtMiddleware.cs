using Chat.Model.Configs;
using Chat.Utils;
using Chat.Utils.MongoDb.UserService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Microsoft.VisualBasic;
using System.IdentityModel.Tokens.Jwt;
using System.Reflection.Metadata;
using System.Text;

namespace Chat.Utils.Middleware
{
    public class JwtMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IMongoDbUserService _userService;

        public JwtMiddleware(RequestDelegate next, IMongoDbUserService userService)
        {
            _next = next;
            _userService = userService;
        }

        public async Task Invoke(HttpContext context)
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
            //var result = false;
            if (token != null)
            {
                await attachUserToContext(context, token);
            }

            //if (result == true) { 
            await _next(context);
            //} else {
            //    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            //    await context.Response.WriteAsync("Unauthorized");
            //}
        }

        private async Task<bool> attachUserToContext(HttpContext context, string token)
        {
            try
            {

                var userId = Jwt.ValidateToken(token);
                if (userId != null)
                {
                    var user = await _userService.GetUserAsync(userId);
                    if (user != null)
                    {
                        context.Items["UserId"] = user.UserId;
                        return true;
                    }
                }
                return false;

            }
            catch (Exception)
            {
                // do nothing if jwt validation fails
                // user is not attached to context so request won't have access to secure routes
                return false;
            }
        }
    }
}
