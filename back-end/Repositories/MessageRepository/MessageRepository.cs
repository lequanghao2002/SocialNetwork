using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Data;
using SocialNetwork.Models.Domain;
using SocialNetwork.Models.DTO.MessageDTO;
using SocialNetwork.Models.DTO.TagDTO;

namespace SocialNetwork.Repositories.MessageRepository
{
    [Authorize]
    public class MessageRepository : IMessageRepository
    {
        private readonly SocialNetworkDbContext _dbContext;
        private readonly IMapper _mapper;

        public MessageRepository(SocialNetworkDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public async Task<List<GetMessageDTO>> GetByUserId(string userId, string otherUserId)
        {
            var messages = await _dbContext.Messages
                .Where(m => 
                    (m.SenderId == userId && m.ReceiverId == otherUserId) || 
                    (m.SenderId == otherUserId && m.ReceiverId == userId))
                .OrderBy(m => m.CreatedDate)
                .ToListAsync();

            return _mapper.Map<List<GetMessageDTO>>(messages);
        }
    }
}
