using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SocialNetwork.Models.DTO.UserDTO;
using SocialNetwork.Repositories;
using SocialNetwork.Services;

namespace SocialNetwork.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IUserService _userService;
        public UsersController(IUserRepository userRepository, IUserService userService) {
            _userRepository = userRepository;
            _userService = userService;
        }

        [HttpGet("get-by-id")]
        public async Task<IActionResult> GetById(string id)
        {
            try
            {
                var userId = _userService.GetUserId();
                var userById = await _userRepository.GetById(userId, id);

                return Ok(userById);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("update-profile-info")]
        public async Task<IActionResult> UpdateProfileInfo(UpdateProfileInfoDTO updateProfileInfoDTO)
        {
            try
            {
                var userId = _userService.GetUserId();
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var result = await _userRepository.UpdateProfileInfo(userId, updateProfileInfoDTO);

                if (result != null)
                {
                    return Ok(result);
                }
                else
                {
                    return BadRequest("Update user profile error");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPut("update-profile-detail")]
        public async Task<IActionResult> UpdateProfileDetail(UpdateProfileDetailDTO updateProfileDetailDTO)
        {
            try
            {
                var userId = _userService.GetUserId();
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var result = await _userRepository.UpdateProfileDetail(userId, updateProfileDetailDTO);

                if (result != null)
                {
                    return Ok(result);
                }
                else
                {
                    return NotFound("User profile not found");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }



        [HttpGet("get-status-friend")]
        public async Task<IActionResult> GetStatusFriend(string userId, string friendId)
        {
            try
            {
                var result = await _userRepository.GetStatusFriend( userId,  friendId);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("change-status-friend")]
        public async Task<IActionResult> ChangeStatusFriend(ChangeStatusFriendDTO changeStatusFriendDTO)
        {
            try
            {
                var result = await _userRepository.ChangeStatusFriend(changeStatusFriendDTO);

                if(result)
                {
                     return Ok(true);
                }
                else
                {
                    return BadRequest("No find status");
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("get-list-friendship")]
        public async Task<IActionResult> GetListFriendShip(string Id)
        {
            try
            {
               var result = await _userRepository.GetListFriendShip(Id);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
