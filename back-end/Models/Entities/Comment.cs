namespace SocialNetwork.Models.Domain
{
    public class Comment : BaseDate
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
        public string PostId { get; set; }
        public Post Post { get; set; }
        public string? ParentId { get; set; }
        public string? Content { get; set; }
        public string? ImageUrl { get; set; }
    }
}
