using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using SocialNetwork.Models.Domain;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SocialNetwork.Repositories
{
    public interface ITokenRepository
    {
        string CreateJwtToken(User user, string Uid, List<string> roles);
    }
    public class TokenRepository : ITokenRepository
    {
        private readonly IConfiguration _configuration;
        public TokenRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public string CreateJwtToken(User user, string Uid, List<string> roles)
        {
            var claims = new List<Claim>
            {
                //new Claim("Id", user.Id),
                //new Claim(ClaimTypes.Email, user.Email),
                //new Claim("FirstName", user.FirstName),
                //new Claim("LastName", user.LastName),
                //new Claim("AvatarUrl", user.AvatarUrl),
                //new Claim("DateOfBirth", user.DateOfBirth.ToString("O")), 
                //new Claim("CreatedDate", user.CreatedDate.ToString("O"))


                new Claim(JwtRegisteredClaimNames.Sub, user.Id), // Dùng "sub" theo chuẩn
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()), // Unique Token ID
                new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64) // Issued At
            };

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            // Tạo khóa bảo mật
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:ValidIssuer"],
                audience: _configuration["Jwt:ValidAudience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(30),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
