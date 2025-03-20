using System.Text.Json.Serialization;

namespace SocialNetwork.Models.Domain
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum FriendshipStatus
    {
        NotFriends,      // Không phải bạn bè
        PendingRequest,  // Đang chờ xác nhận kết bạn
        Friends,         // Đã kết bạn
        Blocked          // Đã chặn
    }
    public class Friendship
    {
        public string RequesterId { get; set; }
        public User Requester { get; set; }
        public string AddresseeId { get; set; }
        public User Addressee { get; set; }
        public FriendshipStatus Status { get; set; }
        public DateTime RequestDate { get; set; }
        public DateTime? AcceptDate { get; set; }
    }
}
