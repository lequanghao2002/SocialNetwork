using SocialNetwork.Models.Domain;
using SocialNetwork.Models.DTO.UserDTO;

namespace SocialNetwork.Models.DTO.AuthDTO
{
    public class GetInfoUser
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string AvatarUrl { get; set; } = string.Empty;
        public string Email { get; set; }
        public DateTime DateOfBirth { get; set; }
        public DateTime CreatedDate { get; set; }
        public GetUserProfileDTO UserProfile { get; set; }
    }
}
