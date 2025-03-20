using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Data;
using SocialNetwork.Models.Domain;
using SocialNetwork.Models.DTO.CommentDTO;
using SocialNetwork.Models.DTO.NotificationDTO;
using SocialNetwork.Models.DTO.UserDTO;
using SocialNetwork.Models.Entities;

namespace SocialNetwork.Repositories
{
    public interface INotificationRepository
    {
        public Task<GetNotificationDTO> Add(AddNotificationDTO notificationDTO);
        public Task<GetNotificationDTO> Delete(string senderId, string receiverId, NotificationType type);
    }
    public class NotificationRepository : INotificationRepository
    {
        private readonly SocialNetworkDbContext _dbContext;
        private readonly IMapper _mapper;
        public NotificationRepository(SocialNetworkDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public async Task<GetNotificationDTO> Add(AddNotificationDTO notificationDTO)
        {

            var notification = _mapper.Map<Notification>(notificationDTO);
            await _dbContext.Notifications.AddAsync(notification);
            await _dbContext.SaveChangesAsync();

            return _mapper.Map<GetNotificationDTO>(notification);
        }

        public async Task<GetNotificationDTO> Delete(string senderId, string receiverId, NotificationType type)
        {
            
            var notification = await _dbContext.Notifications.SingleOrDefaultAsync(n => (n.SenderId == senderId && n.ReceiverId == receiverId) || (n.SenderId == receiverId && n.ReceiverId == senderId) && n.Type == type);

            if (notification == null) return null;

            _dbContext.Notifications.Remove(notification);
            await _dbContext.SaveChangesAsync();

            return _mapper.Map<GetNotificationDTO>(notification);
        }

    }
}
