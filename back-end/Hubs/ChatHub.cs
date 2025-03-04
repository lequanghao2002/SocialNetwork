using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using SocialNetwork.Data;
using SocialNetwork.Models.Domain;
using SocialNetwork.Models.DTO.MessageDTO;
using SocialNetwork.Models.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace SocialNetwork.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly SocialNetworkDbContext _socialNetworkDbContext;
        private readonly IMapper _mapper;
        public ChatHub(SocialNetworkDbContext socialNetworkDbContext, IMapper mapper)
        {
            _socialNetworkDbContext = socialNetworkDbContext;
            _mapper = mapper;
        }

        public override async Task OnConnectedAsync()
        {
            var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!string.IsNullOrEmpty(userId))
            {
                // Thêm user vào group riêng dựa trên UserId (dùng để gửi tin nhắn đúng người)
                await Groups.AddToGroupAsync(Context.ConnectionId, userId);
            }

            await base.OnConnectedAsync();
        }


        public async Task SendMessage(AddMessageDTO addMessageDTO)
        {
            var newMsg = _mapper.Map<Message>(addMessageDTO);

            await _socialNetworkDbContext.Messages.AddAsync(newMsg);
            await _socialNetworkDbContext.SaveChangesAsync();

            var senderMessage = new
            {
                type = "sent",
                message = newMsg
            };

            var receiverMessage = new
            {
                type = "received",
                message = newMsg
            };

            await Clients.Group(addMessageDTO.SenderId).SendAsync("ReceiveMessage", senderMessage);
            await Clients.Group(addMessageDTO.ReceiverId).SendAsync("ReceiveMessage", receiverMessage);
        }
    }
}
