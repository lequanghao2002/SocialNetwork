using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using SocialNetwork.Extensions;
using SocialNetwork.Models.DTO.CommentDTO;
using SocialNetwork.Models.DTO.MessageDTO;
using SocialNetwork.Repositories;
using SocialNetwork.Repositories.MessageRepository;
using SocialNetwork.Services;

namespace SocialNetwork.Hubs
{
    [Authorize]
    public class RealtimeHub : Hub
    {
        private readonly IChatService _chatService;
        private readonly ICommentService _commentService;

        public RealtimeHub(IChatService chatService, ICommentService commentService)
        {
            _chatService = chatService;
            _commentService = commentService;
        }

        #region Chat Services
        public override async Task OnConnectedAsync()
        {
            var userId = Context.GetUserId();
            if (!string.IsNullOrEmpty(userId))
            {
                await _chatService.OnUserConnected(Context.ConnectionId, userId);
            }
            await base.OnConnectedAsync();
        }
        public async Task SendMessage(AddMessageDTO message) => await _chatService.SendMessage(message);
        public async Task UpdateMessage(UpdateMessageDTO message) => await _chatService.UpdateMessage(Context.GetUserId(), message);
        public async Task DeleteMessage(string messageId) => await _chatService.DeleteMessage(Context.GetUserId(), messageId);
        #endregion

        #region Comment Services
        public async Task JoinPostGroup(string postId) => await _commentService.JoinPostGroup(Context.ConnectionId, postId);
        public async Task LeavePostGroup(string postId) => await _commentService.LeavePostGroup(Context.ConnectionId, postId);
        public async Task AddComment(AddCommentDTO comment) => await _commentService.AddComment(Context.GetUserId(), comment);
        public async Task UpdateComment(UpdateCommentDTO comment) => await _commentService.UpdateComment(Context.GetUserId(), comment);
        public async Task DeleteComment(string commentId) => await _commentService.DeleteComment(Context.GetUserId(), commentId);
        #endregion
    }
}
