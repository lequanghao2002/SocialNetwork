namespace SocialNetwork.Models.Domain
{
    public class Comment : BaseDate
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public User User { get; set; }
        public string PostId { get; set; }
        public Post Post { get; set; }
        public string? ParentId { get; set; } = string.Empty;
        public string Content { get; set; }
    }
}
