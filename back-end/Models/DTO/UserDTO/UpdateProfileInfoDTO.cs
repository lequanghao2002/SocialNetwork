namespace SocialNetwork.Models.DTO.UserDTO
{
    public class UpdateProfileInfoDTO
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string? AvatarUrl { get; set; } 
        public string? CoverPhotoUrl { get; set; }
    }
}
