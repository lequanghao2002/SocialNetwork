using SocialNetwork.Models.Domain;
using System.Text.Json.Serialization;

namespace SocialNetwork.Models.Entities
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum NotificationType
    {
        FriendRequestSent,
        FriendRequestAccepted,
        NewMessage,
        PostLiked,
        PostShared,
        PostCommented,
        CommentLiked,
        CommentReplied
    }
    public class Notification
    {
        public string Id { get; set; }
        public string SenderId { get; set; }
        public User Sender { get; set; }
        public string ReceiverId { get; set; }
        public User Receiver { get; set; }
        public NotificationType Type { get; set; }
        public string? PostId { get; set; }
        public string? CommentId { get; set; }
        public string Message { get; set; }
        public bool IsRead { get; set; } = false;
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    }
}
