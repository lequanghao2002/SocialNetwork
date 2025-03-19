using SocialNetwork.Models.Domain;

namespace SocialNetwork.Models.DTO.FriendshipDTO
{
    public class GetFriendDTO
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string AvatarUrl { get; set; }
    }
}
