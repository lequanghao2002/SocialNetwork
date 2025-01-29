﻿using Microsoft.AspNetCore.Identity;
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
                new Claim("Id", user.Id),
                new Claim("Uid", Uid),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim("FirstName", user.FirstName),
                new Claim("LastName", user.LastName),
                new Claim("AvatarUrl", user.AvatarUrl),
                new Claim("DateOfBirth", user.DateOfBirth.ToString("O")), 
                new Claim("CreatedDate", user.CreatedDate.ToString("O")) 
            };

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var key = new
           SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var token = new JwtSecurityToken(
            _configuration["Jwt:ValidIssuer"],
            _configuration["Jwt:ValidAudience"],
            claims,
            //expires: DateTime.Now.AddMinutes(30),
            signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
