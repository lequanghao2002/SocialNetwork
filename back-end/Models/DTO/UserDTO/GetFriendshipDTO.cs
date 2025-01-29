using SocialNetwork.Models.Domain;

namespace SocialNetwork.Models.DTO.UserDTO
{
    public class GetFriendshipDTO
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string AvatarUrl { get; set; }
        public GetUserProfileDTO UserProfile { get; set; }
    }
}
