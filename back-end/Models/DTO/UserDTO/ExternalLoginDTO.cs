namespace SocialNetwork.Models.DTO.UserDTO
{
    public class ExternalLoginDTO
    {
        public string Provider { get; set; }
        public string Uid { get; set; }
        public string DisplayName { get; set; }
        public string Email { get; set; }
        public string PhotoURL { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}
