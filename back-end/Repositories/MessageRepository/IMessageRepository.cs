using SocialNetwork.Models.DTO.CommentDTO;
using SocialNetwork.Models.DTO.MessageDTO;
using SocialNetwork.Models.Entities;

namespace SocialNetwork.Repositories.MessageRepository
{
    public interface IMessageRepository
    {
        public Task<List<GetMessageDTO>> GetByUserId(string userId, string otherUserId);
        public Task MarkMessagesAsSeen(string userId, string otherUserId);
        public Task<Message> Add(AddMessageDTO message);
        public Task<GetMessageDTO> Update(string userId, UpdateMessageDTO message);
        public Task<GetMessageDTO> Delete(string userId, string id);
    }
}
