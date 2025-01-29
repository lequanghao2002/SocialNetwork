using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Data;
using SocialNetwork.Models.Domain;

namespace SocialNetwork.Repositories
{
    public interface IPostTagRepository
    {
        public Task<List<PostTag>> GetByPostId(string postId);
        public Task<bool> Add(List<string> listTag, string postId);
        public Task<bool> Delete(string postId);
    }
    public class PostTagRepository : IPostTagRepository
    {
        private readonly SocialNetworkDbContext _dbContext;
        private readonly ITagRepository _tagRepository;

        public PostTagRepository(SocialNetworkDbContext dbContext, ITagRepository tagRepository) {
            _dbContext = dbContext;
            _tagRepository = tagRepository;
        }

        public async Task<List<PostTag>> GetByPostId(string postId)
        {
            var listPostTag = await _dbContext.PostTags.Where(pt => pt.PostId == postId).ToListAsync();
            return listPostTag;
        }

        public async Task<bool> Add(List<string> listTag, string postId)
        {
            var listPostTags = new List<PostTag>(); 
            
            foreach(var tagName in listTag) {
                string tagId = await _tagRepository.Add(tagName);

                var postTagNew = new PostTag
                {
                    PostId = postId,
                    TagId = tagId
                };

                listPostTags.Add(postTagNew);
            }

            await _dbContext.PostTags.AddRangeAsync(listPostTags);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> Delete(string postId)
        {
            var postTagDelete = await _dbContext.PostTags.Where(pt => pt.PostId == postId).ToListAsync();

            _dbContext.PostTags.RemoveRange(postTagDelete);
            await _dbContext.SaveChangesAsync();

            return true;
        }
    }
}
