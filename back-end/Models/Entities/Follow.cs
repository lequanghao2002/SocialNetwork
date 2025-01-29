namespace SocialNetwork.Models.Domain
{
    public class Follow
    {
        public string follower { set; get; } 
        public User User { get; set; }
        public string follwing { set; get; }
        public DateTime FollowDate { set; get; }
    }
}
