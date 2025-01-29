namespace SocialNetwork.Models.Domain
{
    public class Tag
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public ICollection<PostTag> PostTags { get; set; }

    }
}
