using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SocialNetwork.Enums;
using SocialNetwork.Models.DTO.FriendshipDTO;
using SocialNetwork.Models.DTO.NotificationDTO;
using SocialNetwork.Models.DTO.UserDTO;
using SocialNetwork.Models.Entities;
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
        private readonly INotificationService _notificationService;
        private readonly INotificationRepository _notificationRepository;
        public UsersController(IUserRepository userRepository, IUserService userService, INotificationService notificationService, INotificationRepository notificationRepository) {
            _userRepository = userRepository;
            _userService = userService;
            _notificationService = notificationService;
            _notificationRepository = notificationRepository;
        }

        [HttpGet("get-by-id")]
        public async Task<IActionResult> GetById(string id)
        {
            try
            {
                var userId = _userService.GetUserId();
                var userById = await _userRepository.GetWithFriendById(userId, id);

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

        [HttpPost("send-friend-request")]
        public async Task<IActionResult> SendFriendRequest(string receiverId)
        {
            try
            {
                var userId = _userService.GetUserId();
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var sender = await _userRepository.SendFriendRequest(userId, receiverId);

                if (sender == null)
                {
                    return NotFound("Unable to send friend request.");
                }

                var notification = new AddNotificationDTO
                {
                    SenderId = userId,
                    ReceiverId = receiverId,
                    Type = NotificationType.FriendRequestSent,
                };
                await _notificationService.AddNotification(NotificationEventType.SendFriendRequest, notification);

                return Ok(sender);

               
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("cancel-friend-request")]
        public async Task<IActionResult> CancelFriendRequest(string receiverId)
        {
            try
            {
                var userId = _userService.GetUserId();
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var result = await _userRepository.CancelFriendRequest(userId, receiverId);

                if (!result)
                {
                    return NotFound("Unable to cancel friend request.");
                }
                
                await _notificationService.DeleteNotification(NotificationEventType.CancelFriendRequest, NotificationType.FriendRequestSent, userId, receiverId);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("decline-friend-request")]
        public async Task<IActionResult> DeclineFriendRequest(string receiverId)
        {
            try
            {
                var userId = _userService.GetUserId();
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var result = await _userRepository.CancelFriendRequest(receiverId, userId);

                if (!result)
                {
                    return NotFound("Unable to decline friend request.");
                }

                await _notificationService.DeleteNotification(NotificationEventType.DeclineFriendRequest, NotificationType.FriendRequestSent, userId, receiverId);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("accept-friend-request")]
        public async Task<IActionResult> AcceptFriendRequest(string receiverId)
        {
            try
            {
                var userId = _userService.GetUserId();
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var result = await _userRepository.AcceptFriendRequest(receiverId, userId);

                if (!result)
                {
                    return NotFound("Unable to decline friend request.");
                }

                var notification = new AddNotificationDTO
                {
                    SenderId = userId,
                    ReceiverId = receiverId,
                    Type = NotificationType.FriendRequestAccepted,
                };

                await _notificationService.AddNotification(NotificationEventType.AcceptFriendRequest, notification);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("send-unfriend-request")]
        public async Task<IActionResult> SendUnfriendRequest(string receiverId)
        {
            try
            {
                var userId = _userService.GetUserId();
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var result = await _userRepository.SendUnfriendRequest(userId, receiverId);

                if (!result)
                {
                    return NotFound("Unable to unfriend friend request.");
                }

                await _notificationRepository.Delete(userId, receiverId, NotificationType.FriendRequestSent);
                await _notificationRepository.Delete(userId, receiverId, NotificationType.FriendRequestAccepted);

                return Ok(result);
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
