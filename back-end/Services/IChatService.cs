using SocialNetwork.Models.DTO.MessageDTO;

namespace SocialNetwork.Services
{
    public interface IChatService
    {
        Task OnUserConnected(string connectionId, string userId);
        Task SendMessage(AddMessageDTO addMessageDTO);
        Task UpdateMessage(string userId, UpdateMessageDTO updateMessageDTO);
        Task DeleteMessage(string userId, string messageId);
    }
}
