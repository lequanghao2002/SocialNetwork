using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Data;
using SocialNetwork.Models.DTO.MessageDTO;
using SocialNetwork.Models.Entities;

namespace SocialNetwork.Repositories
{
    public interface IMessageRepository
    {
        public Task<List<GetMessageDTO>> GetByUserId(string userId, string otherUserId);
        public Task MarkMessagesAsSeen(string userId, string otherUserId);
        public Task<Message> Add(AddMessageDTO message);
        public Task<GetMessageDTO> Update(string userId, UpdateMessageDTO message);
        public Task<GetMessageDTO> Delete(string userId, string id);
    }

    public class MessageRepository : IMessageRepository
    {
        private readonly SocialNetworkDbContext _dbContext;
        private readonly IMapper _mapper;

        public MessageRepository(SocialNetworkDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public async Task<Message> Add(AddMessageDTO message)
        {
            var msg = _mapper.Map<Message>(message);

            await _dbContext.Messages.AddAsync(msg);
            await _dbContext.SaveChangesAsync();

            return msg;
        }

        public async Task<GetMessageDTO> Update(string userId, UpdateMessageDTO message)
        {
            var msg = await _dbContext.Messages.SingleOrDefaultAsync(m => m.Id == message.Id);

            if (msg == null || msg.SenderId != userId) return null;

            msg.Content = message.Content;
            msg.UpdatedDate = DateTime.UtcNow;

            await _dbContext.SaveChangesAsync();

            return _mapper.Map<GetMessageDTO>(msg);
        }

        public async Task<GetMessageDTO> Delete(string userId, string id)
        {
            var msg = await _dbContext.Messages.SingleOrDefaultAsync(m => m.Id == id);

            if (msg == null || msg.SenderId != userId) return null;

            msg.DeletedDate = DateTime.UtcNow;
            msg.Deleted = true;

            await _dbContext.SaveChangesAsync();

            return _mapper.Map<GetMessageDTO>(msg);
        }

        public async Task<List<GetMessageDTO>> GetByUserId(string userId, string otherUserId)
        {
            var messages = await _dbContext.Messages
                .Where(m =>
                    m.SenderId == userId && m.ReceiverId == otherUserId ||
                    m.SenderId == otherUserId && m.ReceiverId == userId)
                .OrderBy(m => m.CreatedDate)
                .ToListAsync();

            return _mapper.Map<List<GetMessageDTO>>(messages);
        }

        public async Task MarkMessagesAsSeen(string userId, string otherUserId)
        {
            await _dbContext.Database.ExecuteSqlRawAsync("UPDATE Messages SET IsSeen = 1 WHERE SenderId = {0} AND ReceiverId = {1} AND IsSeen = 0", otherUserId, userId);
        }
    }
}
