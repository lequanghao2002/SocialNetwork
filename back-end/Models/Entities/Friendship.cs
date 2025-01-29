namespace SocialNetwork.Models.Domain
{
    public enum FriendshipStatus
    {
        Not,
        Request,
        Friend,
        Blocked
    }
    public class Friendship
    {
        public string UserId { get; set; }
        public User User { get; set; }
        public string FriendId { get; set; }
        public FriendshipStatus status { get; set; }
        public DateTime RequestDate { get; set; }
        public DateTime? AcceptDate { get; set; }

    }
}
