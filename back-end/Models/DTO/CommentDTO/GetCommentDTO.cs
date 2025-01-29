using SocialNetwork.Models.Domain;
using SocialNetwork.Models.DTO.PostDTO;
using SocialNetwork.Models.DTO.UserDTO;

namespace SocialNetwork.Models.DTO.CommentDTO
{
    public class GetCommentDTO : BaseDate
    {
        public string Id { get; set; }
        public GetUserDTO User { get; set; }
        public string? ParentId { get; set; } = string.Empty;
        public string Content { get; set; }
    }
}
