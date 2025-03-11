using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace SocialNetwork.Hubs
{
    [Authorize]
    public class CommentHub : Hub
    {

    }
}
