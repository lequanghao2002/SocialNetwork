using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace SocialNetwork.Extensions
{
    public static class HubExtensions
    {
        // Tạo method GetUserId cho HubCallerContext
        public static string GetUserId(this HubCallerContext context)
        {
            return context.User.FindFirst(ClaimTypes.NameIdentifier).Value;
        }
    }
}
