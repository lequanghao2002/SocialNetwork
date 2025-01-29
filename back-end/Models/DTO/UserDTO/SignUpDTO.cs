using System.ComponentModel.DataAnnotations;

namespace SocialNetwork.Models.DTO.UserDTO
{
    public class SignUpDTO
    {
        [Required(ErrorMessage = "Please enter first name")]
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Please enter last name")]
        public string LastName { get; set; }

        [Required(ErrorMessage = "Please enter email")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Please enter date of birth")]
        public DateTime DateOfBirth { get; set; }

        [Required(ErrorMessage = "Please enter phone number")]
        public string PhoneNumber { get; set; }


        [Required(ErrorMessage = "Please enter password")]
        [MinLength(3, ErrorMessage = "Password must have at least 3 characters")]
        public string Password { get; set; }


        [Required(ErrorMessage = "Please enter re-password")]
        public string RePassword { get; set; }
    }
}
