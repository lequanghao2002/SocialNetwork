using Google.Apis.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Data;
using SocialNetwork.Models.Domain;
using SocialNetwork.Models.DTO.UserDTO;
using System.Runtime.Serialization;

namespace SocialNetwork.Repositories
{
    public interface IAuthRepository
    {
        public Task<string> GoogleLogin(string tokenId);
        public Task<bool> SignUp(SignUpDTO signUpDTO);
        public Task<string> SignIn(SignInDTO signInDTO);
        public Task<string> ExternalLogin(ExternalLoginDTO externalLoginDTO);
    }

    public class AuthRepository : IAuthRepository
    {
        private readonly SocialNetworkDbContext _socialNetworkDbContext;
        private readonly UserManager<User> _userManager;
        private readonly ITokenRepository _tokenRepository;

        public AuthRepository(SocialNetworkDbContext socialNetworkDbContext, UserManager<User> userManager, ITokenRepository tokenRepository)
        {
            _socialNetworkDbContext = socialNetworkDbContext;
            _userManager = userManager;
            _tokenRepository = tokenRepository;
        }

        public async Task<string> GoogleLogin(string tokenId)
        {
            var settings = new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { "938372474737-9qrdlj8jurm1c1j3dpaasptv4stu27e5.apps.googleusercontent.com" }
            };

            // Xác thực token và lấy thông tin user từ Google
            var payload = await GoogleJsonWebSignature.ValidateAsync(tokenId, settings);

            if (payload == null)
            {
                return string.Empty;
            }

            // Kiểm tra xem user đã có trong hệ thống chưa
            var user = await _userManager.FindByEmailAsync(payload.Email);

            if (user == null)
            {
                // Nếu chưa có, tạo tài khoản mới
                user = new User
                {
                    UserName = payload.Email,
                    Email = payload.Email,
                    FirstName = payload.GivenName,
                    LastName = payload.FamilyName,
                    AvatarUrl = payload.Picture,
                    CreatedDate = DateTime.UtcNow
                };

                var createResult = await _userManager.CreateAsync(user);
                if (!createResult.Succeeded)
                {
                    return string.Empty;
                }

                // Gán role mặc định
                await _userManager.AddToRoleAsync(user, "User");
            }

            // Tạo JWT token
            var roles = await _userManager.GetRolesAsync(user);
            var jwtToken = _tokenRepository.CreateJwtToken(user, payload.Subject, roles.ToList());

            return jwtToken;
        }

        [HttpPost("sign-up")]
        public async Task<bool> SignUp(SignUpDTO signUpDTO)
        {
            var user = new User
            {
                FirstName = signUpDTO.FirstName,
                LastName = signUpDTO.LastName,
                UserName = signUpDTO.Email,
                Email = signUpDTO.Email,
                PhoneNumber = signUpDTO.PhoneNumber,
                DateOfBirth = signUpDTO.DateOfBirth,
                CreatedDate = DateTime.Now,
            };

            var result = await _userManager.CreateAsync(user, signUpDTO.Password);

            if (result.Succeeded)
            {
                result = await _userManager.AddToRoleAsync(user, "User");

                if (result.Succeeded)
                {
                    await _socialNetworkDbContext.SaveChangesAsync();
                    return true;
                }
            }

            return false;
        }

        [HttpPost("sign-in")]
        public async Task<string> SignIn(SignInDTO signInDTO)
        {
            var checkUser = await _userManager.FindByEmailAsync(signInDTO.Email);

            if (checkUser != null)
            {
                var checkPassword = await _userManager.CheckPasswordAsync(checkUser, signInDTO.Password);

                if (checkPassword)
                {
                    var roles = await _userManager.GetRolesAsync(checkUser);
                    if (roles != null)
                    {
                        var jwtToken = _tokenRepository.CreateJwtToken(checkUser, "", roles.ToList());

                        return jwtToken;
                    }
                }
            }

            return string.Empty;
        }

        public async Task<string> ExternalLogin(ExternalLoginDTO externalLoginDTO)
        {
            UserLoginInfo info;
            switch (externalLoginDTO.Provider)
            {
                case "Facebook":
                    info = new UserLoginInfo("Facebook", externalLoginDTO.Uid, "Facebook");
                    break;
                case "Google":
                    info = new UserLoginInfo("Google", externalLoginDTO.Uid, "Google");
                    break;
                case "Github":
                    info = new UserLoginInfo("Github", externalLoginDTO.Uid, "Github");
                    break;
                default:
                    return string.Empty;
            }

            var user = await _userManager.FindByLoginAsync(info.LoginProvider, info.ProviderKey);

            if (user == null)
            {
                user = await _userManager.FindByEmailAsync(externalLoginDTO.Email);
                if (user == null)
                {
                    user = new User
                    {
                        UserName = externalLoginDTO.Email,
                        Email = externalLoginDTO.Email,
                        AvatarUrl = externalLoginDTO.PhotoURL,
                        FirstName = externalLoginDTO.FirstName,
                        LastName = externalLoginDTO.LastName,
                        CreatedDate = DateTime.Now
                    };

                    var createResult = await _userManager.CreateAsync(user);
                    if (!createResult.Succeeded)
                    {
                        return string.Empty;
                    }

                    var roleResult = await _userManager.AddToRoleAsync(user, "User");
                    if (!roleResult.Succeeded)
                    {
                        return string.Empty;
                    }

                    await _socialNetworkDbContext.SaveChangesAsync();
                }

                var loginResult = await _userManager.AddLoginAsync(user, info);
                if (!loginResult.Succeeded)
                {
                    return string.Empty;
                }
            }

            var roles = await _userManager.GetRolesAsync(user);
            var jwtToken = _tokenRepository.CreateJwtToken(user, externalLoginDTO.Uid, roles.ToList());

            return jwtToken;
        }

    }
}
