using SocialNetwork.Models.Domain;

namespace SocialNetwork.Models.DTO.PostDTO
{
    public class SharePostDTO
    {
        public string UserId { get; set; }
        public string Content { get; set; }
        public PostStatus Status { get; set; }
        public string SharedPostId { get; set; }
    }
}
