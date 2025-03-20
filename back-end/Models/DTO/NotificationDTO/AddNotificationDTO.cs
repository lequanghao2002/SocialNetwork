using SocialNetwork.Models.Domain;
using SocialNetwork.Models.DTO.UserDTO;
using SocialNetwork.Models.Entities;

namespace SocialNetwork.Models.DTO.NotificationDTO
{
    public class AddNotificationDTO
    {
        public string SenderId { get; set; }
        public string ReceiverId { get; set; }
        public NotificationType Type { get; set; }
        public string? PostId { get; set; }
        public string? CommentId { get; set; }
        public string? Message { get; set; }
    }

}
