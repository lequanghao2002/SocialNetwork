using SocialNetwork.Models.Domain;
using SocialNetwork.Models.DTO.TagDTO;
using SocialNetwork.Models.DTO.LikeDTO;
using SocialNetwork.Models.DTO.UserDTO;
using SocialNetwork.Models.DTO.CommentDTO;

namespace SocialNetwork.Models.DTO.PostDTO
{
    public class GetPostDTO : BaseDate
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public GetUserDTO User { get; set; }
        public string Content { get; set; }
        public string? Images { get; set; }
        public PostStatus Status { get; set; }
        public GetSharedPostDTO? SharedPost { get; set; }
        public int SharedCount { get; set; } = 0;
        public ICollection<GetTagDTO> Tags { get; set; }
        public ICollection<GetLikeDTO> Likes { get; set; }
        public ICollection<GetCommentDTO> Comments { get; set; }
        public ICollection<GetUserFavouritePostDTO> Favourites { get; set; }
    }
}
