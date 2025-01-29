using SocialNetwork.Models.Entities;

namespace SocialNetwork.Models.Domain
{
    public enum PostStatus
    {
        Public = 1,
        Friend = 2,
        Private = 3
    }
    public class Post : BaseDate
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
        public string Content { get; set; }
        public string Images { get; set; } = string.Empty;
        public PostStatus Status { get; set; }
        public string SharedPostId { get; set; } = string.Empty;
        public ICollection<PostTag> PostTags { get; set; }
        public ICollection<Like> Likes { get; set; }
        public ICollection<Comment> Comments { get; set; }
        public ICollection<Favourite> Favourites { get; set; }
    }
}
