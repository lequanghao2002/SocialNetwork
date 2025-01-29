using SocialNetwork.Models.Domain;

namespace SocialNetwork.Models.DTO.UserDTO
{
    public class ChangeStatusFriendDTO
    {
        public string UserId { get; set; }
        public string FriendId { get; set; }
        public int Status { get; set; }
    }
}
