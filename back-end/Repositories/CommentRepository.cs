using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Data;
using SocialNetwork.Models.Domain;
using SocialNetwork.Models.DTO.CommentDTO;
using SocialNetwork.Models.DTO.PostDTO;

namespace SocialNetwork.Repositories
{
    public interface ICommentRepository
    {
        public Task<List<Comment>> GetListComment(string postId);
        public Task<GetPostDTO> CreateComment(CreateCommentDTO comment);
        public Task<GetPostDTO> UpdateComment(UpdateCommentDTO comment);
        public Task<GetPostDTO> DeleteComment(string id);
    }
    public class CommentRepository : ICommentRepository
    {
        private readonly SocialNetworkDbContext _dbContext;
        private readonly IMapper _mapper;
        private readonly IPostRepository _postRepository;
        public CommentRepository(SocialNetworkDbContext dbContext, IMapper mapper, IPostRepository postRepository)
        {
            _dbContext = dbContext;
            _mapper = mapper;
            _postRepository = postRepository;
        }

        public async Task<List<Comment>> GetListComment(string postId)
        {
            var lstComment = await _dbContext.Comments.Where(x => x.PostId == postId).Select(c => new Comment
            {
                Id = c.Id,
                Post = c.Post,
                User = c.User,
                Content = c.Content,
                CreatedDate = c.CreatedDate
            }).ToListAsync();

            return lstComment;
        }

        public async Task<GetPostDTO> CreateComment(CreateCommentDTO commentDTO)
        {
            var comment = _mapper.Map<Comment>(commentDTO);
            comment.Id = Guid.NewGuid().ToString();
            comment.CreatedDate = DateTime.Now;

            await _dbContext.Comments.AddAsync(comment);
            await _dbContext.SaveChangesAsync();

            var postNewById = await _postRepository.GetById(comment.PostId);

            return postNewById;

        }

        public async Task<GetPostDTO> UpdateComment(UpdateCommentDTO comment)
        {
            var commentUpdate = await _dbContext.Comments.SingleOrDefaultAsync(x => x.Id == comment.Id);
            commentUpdate.Content = comment.Content;

            await _dbContext.SaveChangesAsync();

            var postNewById = await _postRepository.GetById(commentUpdate.PostId);

            return postNewById;
        }

        public async Task<GetPostDTO> DeleteComment(string id)
        {
            var commentDelete = await _dbContext.Comments.SingleOrDefaultAsync(x => x.Id == id);

            _dbContext.Comments.Remove(commentDelete);
            await _dbContext.SaveChangesAsync();

            var postNewById = await _postRepository.GetById(commentDelete.PostId);

            return postNewById;
        }
    }
}
