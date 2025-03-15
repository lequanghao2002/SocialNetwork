using SocialNetwork.Models.Domain;
using SocialNetwork.Models.DTO.UserDTO;

namespace SocialNetwork.Models.DTO.CommentDTO
{
    public class AddCommentDTO
    {
        public string? UserId { get; set; }
        public GetUserDTO? User { get; set; }
        public string PostId { get; set; }
        public string? ParentId { get; set; }
        public string? Content { get; set; }
        public string? ImageUrl { get; set; }
    }
}
