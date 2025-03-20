using SocialNetwork.Models.Domain;
using SocialNetwork.Models.DTO.UserDTO;
using SocialNetwork.Models.Entities;

namespace SocialNetwork.Models.DTO.NotificationDTO
{
    public class GetNotificationDTO
    {
        public string Id { get; set; }
        public string SenderId { get; set; }
        public GetUserDTO Sender { get; set; }
        public string ReceiverId { get; set; }
        public NotificationType Type { get; set; }
        public string? PostId { get; set; }
        public string? CommentId { get; set; }
        public string Message { get; set; }
        public bool IsRead { get; set; } = false;
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    }
}
