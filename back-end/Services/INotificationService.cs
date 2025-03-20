using SocialNetwork.Enums;
using SocialNetwork.Models.DTO.NotificationDTO;
using SocialNetwork.Models.DTO.UserDTO;
using SocialNetwork.Models.Entities;

namespace SocialNetwork.Services
{
    public interface INotificationService
    {
        Task AddNotification(NotificationEventType eventType, AddNotificationDTO notificatioin, GetUserDTO? sender = null);
        Task DeleteNotification(NotificationEventType eventType, NotificationType type, string senderId, string receiverId);
    }
}
