namespace SocialNetwork.Models.Domain
{
    public class UserProfile
    {
        public string UserId { get; set; }
        public User User { get; set; }
        public string? CoverPhotoUrl { get; set; } = string.Empty;
        public string? Introduce { get; set; } = string.Empty;
        public string? LiveAt { get; set; } = string.Empty;
        public string? StudyAt { get; set; } = string.Empty;
        public string? WorkingAt { get; set; } = string.Empty;
        public string? Github { get; set; } = string.Empty;
        public string? Facebook { get; set; } = string.Empty;
        public string? LinkedIn { get; set; } = string.Empty;
        public bool IsActive { get; set; }

    }
}
