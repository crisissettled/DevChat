using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Chat.Utils {
    public class Jwt {
        public static string AccessSecret = "asfdasgw2324wr23rfwfsafasd";
        public static string Issuer = "asfdsf";
        public static string Audience = "dfdsfasdf";
        public static int intExpiryInSeconds = 6000;
        public static string GenerateAccessToken(string UserId) {
            var claims = new[]{
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, UserId),
            };
            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(AccessSecret));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var jwtAccessToken = new JwtSecurityToken(
                    Issuer,
                    Audience,
                    claims,
                    expires: DateTime.Now.AddSeconds(intExpiryInSeconds),
                    signingCredentials: credentials,
                    notBefore: DateTime.Now
                );
            return new JwtSecurityTokenHandler().WriteToken(jwtAccessToken);
        }


        public static string GenerateRefreshToken(string UserId) {
            var randomNumber = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return $"{UserId}{Convert.ToBase64String(randomNumber)}";
        }


        public static string? ValidateToken(string token) {

            var tokenHandler = new JwtSecurityTokenHandler();

            tokenHandler.ValidateToken(token, new TokenValidationParameters {
                ValidateIssuerSigningKey = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(AccessSecret)),
                ValidIssuer = Issuer,
                ValidAudience = Audience,
                // set clockskew to zero so tokens expire exactly at token expiration time.
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);

            var jwtToken = (JwtSecurityToken)validatedToken;
            return jwtToken.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

        }
    }
}
