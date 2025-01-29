using SocialNetwork.Models.Domain;

namespace SocialNetwork.Models.DTO.CommentDTO
{
    public class CreateCommentDTO
    {
        public string UserId { get; set; }
        public string PostId { get; set; }
        public string? ParentId { get; set; } = null;
        public string Content { get; set; }
    }
}
