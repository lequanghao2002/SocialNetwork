using SocialNetwork.Models.Domain;

namespace SocialNetwork.Models.DTO.MessageDTO
{
    public class AddMessageDTO
    {
        public string SenderId { get; set; }
        public string ReceiverId { get; set; }
        public string Content { get; set; }
        public string? ImageUrl { get; set; } = string.Empty;
    }
}
