using SocialNetwork.Models.Domain;
using SocialNetwork.Models.DTO.TagDTO;
using SocialNetwork.Models.DTO.UserDTO;

namespace SocialNetwork.Models.DTO.PostDTO
{
    public class GetSharedPostDTO : BaseDate
    {
        public string Id { get; set; }
        public GetUserDTO? User { get; set; }
        public string Content { get; set; }
        public string? Images { get; set; }
        public PostStatus Status { get; set; }
        public ICollection<GetTagDTO>? Tags { get; set; }
    }
}
