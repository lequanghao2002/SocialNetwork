using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SocialNetwork.Models.Domain;
using SocialNetwork.Models.DTO.UserDTO;
using SocialNetwork.Repositories;

namespace SocialNetwork.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountsController : ControllerBase
    {
        private readonly UserManager<User> _userManager; 
        private readonly IAccountRepository _accountRepository;

        public AccountsController(UserManager<User> userManager, IAccountRepository accountRepository)
        {
            _userManager = userManager;
            _accountRepository = accountRepository;
        }

        [HttpPost("sign-up")]
        public async Task<IActionResult> SignUp(SignUpDTO signUpDTO)
        {
            try
            {
                var checkEmail = await _userManager.FindByEmailAsync(signUpDTO.Email);
                if (checkEmail != null)
                {
                    return BadRequest("Email already exists");
                }

                if (signUpDTO.Password != signUpDTO.RePassword)
                {
                    return BadRequest("Passwords do not math");
                }

                var userSignUp = await _accountRepository.SignUp(signUpDTO);
                if (userSignUp == true)
                {
                    return Ok("Sign up account success");
                }

                return BadRequest("Sign up account failed");
            }
            catch
            {
                return BadRequest("Sign up account failed");
            }
        }

        [HttpPost("sign-in")]
        public async Task<IActionResult> SignIn(SignInDTO signInDTO)
        {
            try
            {
                var loginAccount = await _accountRepository.SignIn(signInDTO);

                if (!string.IsNullOrEmpty(loginAccount))
                {
                    return Ok(loginAccount);
                }
                
                return BadRequest("Sign in failed");
            }
            catch
            {
                return BadRequest("Sign in failed");
            }
        }


        [HttpPost("external-login")]
        public async Task<IActionResult> ExternalLogin(ExternalLoginDTO externalLoginDTO)
        {
            var token = await _accountRepository.ExternalLogin(externalLoginDTO);
            if (!string.IsNullOrEmpty(token))
            {
                return Ok(token);
            }
            return BadRequest(new { message = "External login failed" });
        }
    }
}
