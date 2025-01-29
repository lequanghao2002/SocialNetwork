using SocialNetwork.Models.Domain;

namespace SocialNetwork.Models.DTO.UserDTO
{
    public class GetUserByIdDTO
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string AvatarUrl { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public DateTime CreatedDate { get; set; }
        public GetUserProfileDTO UserProfile { get; set; }
    }
}
