using Microsoft.AspNetCore.SignalR;
using SocialNetwork.Enums;
using SocialNetwork.Hubs;
using SocialNetwork.Models.DTO.NotificationDTO;
using SocialNetwork.Models.DTO.UserDTO;
using SocialNetwork.Models.Entities;
using SocialNetwork.Repositories;

namespace SocialNetwork.Services
{

    public class NotificationService : INotificationService
    {
        private readonly IHubContext<RealtimeHub> _hubContext;
        private readonly INotificationRepository _notificationRepository;
        private readonly IUserRepository _userRepository;

        public NotificationService(IHubContext<RealtimeHub> hubContext, INotificationRepository notificationRepository, IUserRepository userRepository)
        {
            _hubContext = hubContext;
            _notificationRepository = notificationRepository;
            _userRepository = userRepository;
        }

        private string GenerateMessage(NotificationType type, GetUserDTO sender)
        {
            var fullName = $"{sender.FirstName} {sender.LastName}";

            return type switch
            {
                NotificationType.FriendRequestSent => $"{fullName} sent you a friend request.",
                NotificationType.FriendRequestAccepted => $"{fullName} accepted your friend request.",
                NotificationType.NewMessage => $"You have a new message from {fullName}.",
                NotificationType.PostLiked => $"{fullName} liked your post.",
                NotificationType.PostShared => $"{fullName} shared your post.",
                NotificationType.PostCommented => $"{fullName} commented on your post.",
                NotificationType.CommentLiked => $"{fullName} liked your comment.",
                NotificationType.CommentReplied => $"{fullName} replied to your comment.",
                _ => "You have a new activity."
            };
        }

        private async Task SendNotification(string receiverId, NotificationEventType eventType, object data)
        {
            var payload = new
            {
                eventType,
                data,
            };

            await _hubContext.Clients.Group(receiverId).SendAsync("ChangeNotification", payload);
        }


        public async Task AddNotification(NotificationEventType eventType, AddNotificationDTO notification, GetUserDTO? senderDTO = null)
        {
            senderDTO ??= await _userRepository.GetById(notification.SenderId);
            notification.Message = GenerateMessage(notification.Type, senderDTO);

            var newNotification = await _notificationRepository.Add(notification);
            newNotification.Sender = senderDTO;

            if (newNotification != null)
            {
                await SendNotification(newNotification.ReceiverId, eventType, newNotification);
            }
        }

        public async Task DeleteNotification(NotificationEventType eventType, NotificationType type, string senderId, string receiverId)
        {

            var deleteNotification = await _notificationRepository.Delete(senderId, receiverId, type);

            if (deleteNotification != null)
            {
                await SendNotification(receiverId, eventType, deleteNotification);
            }
        }
    }
}
