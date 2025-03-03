using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SocialNetwork.Hubs;
using SocialNetwork.Models.DTO.MessageDTO;
using SocialNetwork.Models.DTO.UserDTO;

namespace SocialNetwork.Controllers
{
    [Route("api/chat")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IHubContext<ChatHub> _chatHubContext;

        public ChatController(IHubContext<ChatHub> chatHubContext)
        {
            _chatHubContext = chatHubContext;   
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendMessage(AddMessageDTO addMessageDTO)
        {
            try
            {
                await _chatHubContext.Clients.User(addMessageDTO.ReceiverId)
                     .SendAsync("ReceiveMessage", addMessageDTO);

                return Ok(new { message = "Message sent successfully" });
            }
            catch
            {
                return BadRequest("Send message failed");
            }
        }
    }
}
