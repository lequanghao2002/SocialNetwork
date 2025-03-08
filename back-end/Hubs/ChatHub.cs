using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using SocialNetwork.Data;
using SocialNetwork.Extensions;
using SocialNetwork.Models.DTO.MessageDTO;
using SocialNetwork.Repositories.MessageRepository;

namespace SocialNetwork.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly IMessageRepository _messageRepository;
        public ChatHub(IMessageRepository messageRepository)
        {
            _messageRepository = messageRepository;
        }

        public override async Task OnConnectedAsync()
        {
            var userId = Context.GetUserId();

            if (!string.IsNullOrEmpty(userId))
            {
                // Thêm user vào group riêng dựa trên UserId (dùng để gửi tin nhắn đúng người)
                await Groups.AddToGroupAsync(Context.ConnectionId, userId);
            }

            await base.OnConnectedAsync();
        }

        public async Task SendMessage(AddMessageDTO addMessageDTO)
        {
            var newMsg = await _messageRepository.Add(addMessageDTO);

            await Clients.Group(addMessageDTO.SenderId).SendAsync("ReceiveMessage", newMsg);
            await Clients.Group(addMessageDTO.ReceiverId).SendAsync("ReceiveMessage", newMsg);
        }

        public async Task UpdateMessage(UpdateMessageDTO updateMessageDTO)
        {
            var userId = Context.GetUserId();
            var updatedMessage = await _messageRepository.Update(userId, updateMessageDTO);

            if (updatedMessage != null)
            {
                await Clients.Group(updatedMessage.SenderId).SendAsync("MessageUpdated", updatedMessage);
                await Clients.Group(updatedMessage.ReceiverId).SendAsync("MessageUpdated", updatedMessage);
            }
        }

        public async Task DeleteMessage(string messageId)
        {
            var userId = Context.GetUserId();
            var msg = await _messageRepository.Delete(userId, messageId);

            if (msg != null)
            {
                await Clients.Group(msg.SenderId).SendAsync("MessageUpdated", msg);
                await Clients.Group(msg.ReceiverId).SendAsync("MessageUpdated", msg);
            }
        }

    }
}
