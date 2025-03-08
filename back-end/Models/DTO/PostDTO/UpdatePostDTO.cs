using SocialNetwork.Models.Domain;

namespace SocialNetwork.Models.DTO.PostDTO
{
    public class UpdatePostDTO
    {
        public string? UserId { get; set; }
        public string Id { get; set; }
        public string Content { get; set; }
        public PostStatus Status { get; set; }
        public List<string>? Images { get; set; }
        public List<string>? Tags { get; set; }
    }
}
