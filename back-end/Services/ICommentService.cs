using SocialNetwork.Models.DTO.CommentDTO;

namespace SocialNetwork.Services
{
    public interface ICommentService 
    {
        Task JoinPostGroup(string connectionId, string postId);
        Task LeavePostGroup(string connectionId, string postId);
        Task AddComment(string userId, AddCommentDTO comment);
        Task UpdateComment(string userId, UpdateCommentDTO comment);
        Task DeleteComment(string userId, string commentId);
    }
}
