using SocialNetwork.Models.Domain;

namespace SocialNetwork.Models.Entities
{
    public class Message : BaseDate
    {
        public string Id { get; set; }
        public string SenderId { get; set; }
        public User Sender {  get; set; }
        public string ReceiverId { get; set; }
        public User Receiver { get; set; }
        public string Content { get; set; }
        public string? ImageUrl { get; set; } = string.Empty;
        public bool IsSeen { get; set; } = false;
    }
}
