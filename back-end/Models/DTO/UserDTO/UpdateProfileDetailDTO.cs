using SocialNetwork.Models.Domain;

namespace SocialNetwork.Models.DTO.UserDTO
{
    public class UpdateProfileDetailDTO
    {
        public string? Introduce { get; set; } 
        public string? LiveAt { get; set; } 
        public string? StudyAt { get; set; }
        public string? WorkingAt { get; set; }
        public string? Github { get; set; }
        public string? Facebook { get; set; } 
        public string? LinkedIn { get; set; }
    }
}
