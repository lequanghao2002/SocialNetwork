using SocialNetwork.Models.Domain;

namespace SocialNetwork.Models.DTO.FriendshipDTO
{
    public class GetFriendShipDTO
    {
        public string RequesterId { get; set; }
        public string AddresseeId { get; set; }
        public FriendshipStatus Status { get; set; }
    }
}
