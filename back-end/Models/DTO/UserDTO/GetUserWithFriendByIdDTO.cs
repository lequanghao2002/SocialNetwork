using SocialNetwork.Models.Domain;
using SocialNetwork.Models.DTO.FriendshipDTO;

namespace SocialNetwork.Models.DTO.UserDTO
{
    public class GetUserWithFriendByIdDTO
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string AvatarUrl { get; set; } = string.Empty;
        public FriendshipStatus? Status { get; set; }
        public ICollection<GetFriendDTO> Friends { get; set; }
        public GetUserProfileDTO? UserProfile { get; set; }
    }
}
