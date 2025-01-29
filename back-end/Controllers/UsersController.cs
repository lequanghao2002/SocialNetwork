using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SocialNetwork.Models.DTO.UserDTO;
using SocialNetwork.Repositories;

namespace SocialNetwork.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        public UsersController(IUserRepository userRepository) {
            _userRepository = userRepository;
        }

        [HttpGet("get-by-id")]
        public async Task<IActionResult> GetById(string id)
        {
            try
            {
                var userById = await _userRepository.GetById(id);

                return Ok(userById);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("update-user-profile")]
        public async Task<IActionResult> UpdateUserProfile(UpdateUserProfileDTO updateUserProfileDTO)
        {
            try
            {
                var result = await _userRepository.UpdateUserProfile(updateUserProfileDTO);

                if(result)
                {
                    return Ok("Update user profile success");
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

        [HttpPost("update-user")]
        public async Task<IActionResult> UpdateUser([FromForm] UpdateUserDTO updateUserDTO)
        {
            try
            {
                var result = await _userRepository.UpdateUser(updateUserDTO);

                if (result)
                {
                    return Ok("Update user profile success");
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
