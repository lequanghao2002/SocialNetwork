using Google.Apis.Auth;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using SocialNetwork.Models.Domain;
using SocialNetwork.Models.DTO.AuthDTO;
using SocialNetwork.Repositories;

namespace SocialNetwork.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _authRepository;

        public AuthController(IAuthRepository authRepository)
        {
            _authRepository = authRepository;
        }

        [HttpPost("google-login")]
        public async Task<ActionResult> GoogleLogin(GoogleLoginRequest request)
        {
            if (string.IsNullOrEmpty(request.TokenId))
            {
                return BadRequest(new { message = "tokenId is required" });
            }

            try
            {
                string token = await _authRepository.GoogleLogin(request.TokenId);

                return Ok(token);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Invalid Google Token", error = ex.Message });
            }
        }
    }
}
