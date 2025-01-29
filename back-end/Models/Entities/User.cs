using Microsoft.AspNetCore.Identity;
using SocialNetwork.Models.Entities;

namespace SocialNetwork.Models.Domain
{
    public class User : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string AvatarUrl { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public DateTime CreatedDate { get; set; }

        public UserProfile UserProfile { get; set; }
        public ICollection<Follow> Follows { get; set; }
        public ICollection<Friendship> Friendships { get; set; }
        public ICollection<Post> Posts { get; set; }
        public ICollection<Like> Likes { get; set; }
        public ICollection<Comment> Comments { get; set; }
        public ICollection<Favourite> Favourites { get; set; }
    }
}
