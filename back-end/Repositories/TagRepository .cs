
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Data;
using SocialNetwork.Models.Domain;
using SocialNetwork.Models.DTO.PostDTO;
using SocialNetwork.Models.DTO.TagDTO;

namespace SocialNetwork.Repositories
{
    public interface ITagRepository
    {
        public Task<List<GetTagDTO>> GetAll();
        public Task<string> Add(string tagName);
        public Task<bool> AddMultipleTags(List<AddTagDTO> listTagDTO);
    }
    public class TagRepository : ITagRepository
    {
        private readonly SocialNetworkDbContext _dbContext;
        private readonly IMapper _mapper;

        public TagRepository(SocialNetworkDbContext dbContext, IMapper mapper) {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public async Task<List<GetTagDTO>> GetAll()
        {
            var tagList = await _dbContext.Tags.ToListAsync();

            return _mapper.Map<List<GetTagDTO>>(tagList); 
        }
        public async Task<string> Add(string tagName)
        {
            var checkTagNameExists = await _dbContext.Tags.FirstOrDefaultAsync(t => t.Name == tagName);

            if (checkTagNameExists != null)
            {
                return checkTagNameExists.Id;
            }

            var tagNew = new Tag
            {
                Id = Guid.NewGuid().ToString(),
                Name = tagName,
            };
           
            await _dbContext.Tags.AddAsync(tagNew);
            await _dbContext.SaveChangesAsync();

            return tagNew.Id;
        }

        public async Task<bool> AddMultipleTags(List<AddTagDTO> listTagDTO)
        {
            var tags = listTagDTO.Select( t =>
            {
                var tag = _mapper.Map<Tag>(t);
                tag.Id = Guid.NewGuid().ToString();
                return tag;
            }).ToList();

            await _dbContext.Tags.AddRangeAsync(tags);
            await _dbContext.SaveChangesAsync();

            return true;
        }

    }
}
