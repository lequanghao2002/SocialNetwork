using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SocialNetwork.Repositories.MessageRepository;

namespace SocialNetwork.Controllers
{
    [Route("api/message")]
    [ApiController]
    [Authorize]
    public class MessagesController : ControllerBase
    {
        private readonly IMessageRepository _messageRepository;

        public MessagesController(IMessageRepository messageRepository)
        {
            _messageRepository = messageRepository;
        }

        [HttpGet("get-by-userId")]
        public async Task<IActionResult> GetByUserId(string userId, string otherUserId)
        {
            try
            {
                var messages = await _messageRepository.GetByUserId(userId, otherUserId);

                return Ok(messages);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
