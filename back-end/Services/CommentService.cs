using Microsoft.AspNetCore.SignalR;
using SocialNetwork.Hubs;
using SocialNetwork.Models.Domain;
using SocialNetwork.Models.DTO.CommentDTO;
using SocialNetwork.Repositories;

namespace SocialNetwork.Services
{
    public class CommentService : ICommentService
    {
        private readonly ICommentRepository _commentRepository;
        private readonly IHubContext<RealtimeHub> _hubContext;

        public CommentService(ICommentRepository commentRepository, IHubContext<RealtimeHub> hubContext)
        {
            _commentRepository = commentRepository;
            _hubContext = hubContext;
        }

        public async Task JoinPostGroup(string connectionId, string postId)
        {
            await _hubContext.Groups.AddToGroupAsync(connectionId, postId);
        }

        public async Task LeavePostGroup(string connectionId, string postId)
        {
            await _hubContext.Groups.RemoveFromGroupAsync(connectionId, postId);
        }

        public async Task AddComment(string userId, AddCommentDTO comment)
        {
            comment.UserId = userId;
            var newComment = await _commentRepository.Add(comment);

            if (newComment != null)
            {
                await NotifyGroup(newComment.PostId, "created", newComment);
            }
        }
        public async Task UpdateComment(string userId, UpdateCommentDTO comment)
        {
            var updatedComment = await _commentRepository.Update(userId, comment);

            if (updatedComment != null)
            {
                await NotifyGroup(updatedComment.PostId, "updated", updatedComment);
            }
        }

        public async Task DeleteComment(string userId, string commentId)
        {
            var deleteComment = await _commentRepository.Delete(userId, commentId);

            if(deleteComment != null)
            {
                await NotifyGroup(deleteComment.PostId, "deleted", deleteComment);

            }
        }

        public async Task NotifyGroup(string postId, string eventType, object data)
        {
            var payload = new
            {
                eventType,
                data,
            };

            await _hubContext.Clients.Group(postId).SendAsync("CommentChanged", payload);
        }
    }
}
