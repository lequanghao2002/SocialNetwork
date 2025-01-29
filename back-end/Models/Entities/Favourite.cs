using SocialNetwork.Models.Domain;

namespace SocialNetwork.Models.Entities
{
    public class Favourite
    {
        public string UserId { get; set; }
        public User User { get; set; }
        public string PostId { get; set; }
        public Post Post { get; set; }
    }
}
