using System.Text.Json.Serialization;

namespace SocialNetwork.Enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum NotificationEventType
    {
        SendFriendRequest,
        CancelFriendRequest,
        DeclineFriendRequest,
        AcceptFriendRequest,
    }
}
