using SocialNetwork.Models.Domain;
using SocialNetwork.Models.DTO.MessageDTO;

namespace SocialNetwork.Models.DTO.UserDTO
{
    public class GetFriendshipWithLastMsgDTO
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string AvatarUrl { get; set; }
        public GetUserProfileDTO UserProfile { get; set; }
        public GetMessageDTO LastMessage { get; set; }
    }
}
