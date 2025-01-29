namespace SocialNetwork.Models.DTO.UserDTO
{
    public class UpdateUserDTO
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public IFormFile? AvatarUrl { get; set; } = null;
        public IFormFile? CoverPhotoUrl { get; set; } = null;
    }
}
