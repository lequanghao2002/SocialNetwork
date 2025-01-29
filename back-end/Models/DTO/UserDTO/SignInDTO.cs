using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Models.DTO.UserDTO
{
    public class SignInDTO
    {
        [Required(ErrorMessage = "Please enter email")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Please enter password")]
        public string Password { get; set; }
    }
}
