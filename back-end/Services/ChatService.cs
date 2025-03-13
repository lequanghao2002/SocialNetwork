using Microsoft.AspNetCore.SignalR;
using SocialNetwork.Hubs;
using SocialNetwork.Models.DTO.MessageDTO;
using SocialNetwork.Repositories.MessageRepository;

namespace SocialNetwork.Services
{
    public class ChatService : IChatService
    {
        private readonly IMessageRepository _messageRepository;
        private readonly IHubContext<RealtimeHub> _hubContext;

        public ChatService(IMessageRepository messageRepository, IHubContext<RealtimeHub> hubContext)
        {
            _messageRepository = messageRepository;
            _hubContext = hubContext;
        }

        public async Task OnUserConnected(string connectionId, string userId)
        {
            await _hubContext.Groups.AddToGroupAsync(connectionId, userId);
        }

        public async Task SendMessage(AddMessageDTO addMessageDTO)
        {
            var newMsg = await _messageRepository.Add(addMessageDTO);

            await _hubContext.Clients.Group(addMessageDTO.SenderId).SendAsync("ReceiveMessage", newMsg);
            await _hubContext.Clients.Group(addMessageDTO.ReceiverId).SendAsync("ReceiveMessage", newMsg);
        }

        public async Task UpdateMessage(string userId, UpdateMessageDTO updateMessageDTO)
        {
            var updatedMessage = await _messageRepository.Update(userId, updateMessageDTO);

            if (updatedMessage != null)
            {
                await _hubContext.Clients.Group(updatedMessage.SenderId).SendAsync("UpdatedMessage", updatedMessage);
                await _hubContext.Clients.Group(updatedMessage.ReceiverId).SendAsync("UpdatedMessage", updatedMessage);
            }
        }

        public async Task DeleteMessage(string userId, string messageId)
        {
            var msg = await _messageRepository.Delete(userId, messageId);

            if (msg != null)
            {
                await _hubContext.Clients.Group(msg.SenderId).SendAsync("UpdatedMessage", msg);
                await _hubContext.Clients.Group(msg.ReceiverId).SendAsync("UpdatedMessage", msg);
            }
        }
    }
}
