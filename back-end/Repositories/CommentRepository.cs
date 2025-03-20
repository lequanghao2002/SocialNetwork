using AutoMapper;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Data;
using SocialNetwork.Models.Domain;
using SocialNetwork.Models.DTO.CommentDTO;
using SocialNetwork.Models.DTO.PostDTO;
using System.ComponentModel.Design;

namespace SocialNetwork.Repositories
{
    public interface ICommentRepository
    {
        public Task<List<GetCommentDTO>> GetByPostId(string postId);
        public Task<GetCommentDTO> Add(AddCommentDTO comment);
        public Task<GetCommentDTO> Update(string userId, UpdateCommentDTO comment);
        public Task<DeleteCommentDTO> Delete(string userId, string id);
    }
    public class CommentRepository : ICommentRepository
    {
        private readonly SocialNetworkDbContext _dbContext;
        private readonly IMapper _mapper;
        public CommentRepository(SocialNetworkDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public async Task<List<GetCommentDTO>> GetByPostId(string postId)
        {
            var comments = await _dbContext.Comments
                .Where(c => c.PostId == postId && !c.Deleted)
                .Include(c => c.User)
                .OrderByDescending(c => c.CreatedDate)
                .ToListAsync();

            return _mapper.Map<List<GetCommentDTO>>(comments);
        }

        public async Task<GetCommentDTO> Add(AddCommentDTO commentDTO)
        {
            var comment = _mapper.Map<Comment>(commentDTO);

            await _dbContext.Comments.AddAsync(comment);
            await _dbContext.SaveChangesAsync();

            var user = await _dbContext.Users.FindAsync(commentDTO.UserId);
            comment.User = user;

            return _mapper.Map<GetCommentDTO>(comment);
        }

        public async Task<GetCommentDTO> Update(string userId, UpdateCommentDTO commentDTO)
        {
            var comment = await _dbContext.Comments.Include(c => c.User).SingleOrDefaultAsync(x => x.Id == commentDTO.Id);

            if (comment == null || comment.UserId != userId) return null;

            _mapper.Map(commentDTO, comment);

            await _dbContext.SaveChangesAsync();

            return _mapper.Map<GetCommentDTO>(comment);
        }

        public async Task<DeleteCommentDTO> Delete(string userId, string commentId)
        {
            var userIdParam = new SqlParameter("@userId", System.Data.SqlDbType.NVarChar, 450) { Value = userId };
            var commentIdParam = new SqlParameter("@commentId", System.Data.SqlDbType.NVarChar, 450) { Value = commentId };
            var postIdParam = new SqlParameter("@postId", System.Data.SqlDbType.NVarChar, 450)
            {
                Direction = System.Data.ParameterDirection.Output
            };

            await _dbContext.Database.ExecuteSqlRawAsync(
                "EXEC DeleteCommentWithChildren @userId, @commentId, @postId OUTPUT",
                userIdParam, commentIdParam, postIdParam
            );

            // Lấy giá trị PostId từ OUTPUT parameter
            // DBNull.Value trong C# đại diện có một giá trị null trong database khi làm việc với SQL Server
            string postId = postIdParam.Value == DBNull.Value ? null : postIdParam.Value as string;

            if (postId == null) return null;

            // Trả về kết quả
            return new DeleteCommentDTO
            {
                PostId = postId,
                CommentId = commentId
            };
        }

    }
}
