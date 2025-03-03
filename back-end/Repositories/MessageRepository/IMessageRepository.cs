using SocialNetwork.Models.Domain;
using SocialNetwork.Models.DTO.CommentDTO;
using SocialNetwork.Models.DTO.MessageDTO;
using SocialNetwork.Models.DTO.PostDTO;

namespace SocialNetwork.Repositories.MessageRepository
{
    public interface IMessageRepository
    {
        public Task<List<GetMessageDTO>> GetByUserId(string userId, string otherUserId);
        //public Task<GetPostDTO> CreateComment(CreateCommentDTO comment);
        //public Task<GetPostDTO> UpdateComment(UpdateCommentDTO comment);
        //public Task<GetPostDTO> DeleteComment(string id);
    }
}
