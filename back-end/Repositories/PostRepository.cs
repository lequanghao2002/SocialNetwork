using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using SocialNetwork.Data;
using SocialNetwork.Helpers;
using SocialNetwork.Models.Domain;
using SocialNetwork.Models.DTO.CommentDTO;
using SocialNetwork.Models.DTO.FavouriteDTO;
using SocialNetwork.Models.DTO.LikeDTO;
using SocialNetwork.Models.DTO.PostDTO;
using SocialNetwork.Models.DTO.TagDTO;
using SocialNetwork.Models.DTO.UserDTO;
using SocialNetwork.Models.Entities;

namespace SocialNetwork.Repositories
{
    public interface IPostRepository
    {
        public Task<List<GetPostDTO>> Search(string keyword);
        public Task<List<GetPostDTO>> GetAll(string filter, string userId, int page, int pageSize);
        public Task<List<GetPostDTO>> GetAllByUserId(string userId, int page, int pageSize, string visibility);
        public Task<List<GetPostDTO>> GetAllSaved(string userId, int page, int pageSize);
        public Task<GetPostDTO> GetById(string Id);
        public Task<GetPostDTO> Add(AddPostDTO postDTO);
        public Task<GetPostDTO> Update(UpdatePostDTO postDTO);
        public Task<bool> Delete(string id, string userId);
        public Task<string> ChangeLike(ChangeLikeDTO likeDTO);
        public Task<string> Save(FavouritePostDTO favouriteDT0);
        public Task<string> UnSave(FavouritePostDTO favouriteDT0);

    }
    public class PostRepository : IPostRepository
    {
        private readonly SocialNetworkDbContext _dbContext;
        private readonly IMapper _mapper;
        private readonly IPostTagRepository _postTagRepository;

        public PostRepository(SocialNetworkDbContext dbContext, IMapper mapper, IPostTagRepository postTagRepository)
        {
            _dbContext = dbContext;
            _mapper = mapper;
            _postTagRepository = postTagRepository;
        }

        public async Task<List<GetPostDTO>> Search(string keyword)
        {
            var postList = await _dbContext.Posts
                .Where(p => p.Deleted == false && p.Content.Contains(keyword) && p.Status != PostStatus.Private)
                .OrderByDescending(p => p.CreatedDate)
                .Select(p => new GetPostDTO
                {
                    Id = p.Id,
                    UserId = p.UserId,
                    Content = p.Content,
                    Images = p.Images,
                    Status = p.Status,
                    CreatedDate = p.CreatedDate,
                    User = new GetUserDTO
                    {
                        FirstName = p.User.FirstName,
                        LastName = p.User.LastName,
                        AvatarUrl = p.User.AvatarUrl,
                        DateOfBirth = p.User.DateOfBirth,
                        UserName = p.User.UserName,
                        Email = p.User.Email,
                        PhoneNumber = p.User.PhoneNumber,
                    },
                    Tags = p.PostTags.Select(t => new GetTagDTO
                    {
                        Id = t.Tag.Id,
                        Name = t.Tag.Name
                    }).ToList(),
                    Likes = p.Likes.Select(l => new GetLikeDTO
                    {
                        UserId = l.User.Id,
                    }).ToList(),
                    Favourites = p.Favourites.Select(x => new GetFavouriteDTO { UserId = x.UserId }).ToList()

                }).ToListAsync();


            return postList;
        }

        public async Task<List<GetPostDTO>> GetAll(string filter, string userId, int page, int pageSize)
        {
            IQueryable<Post> query = _dbContext.Posts
                .Where(p => !p.Deleted && p.Status != PostStatus.Private)
                .Include(p => p.User)
                .Include(p => p.Likes)
                .Include(p => p.Comments.Where(c => !c.Deleted)) // Chỉ lấy comment chưa bị xóa
                .Include(p => p.PostTags).ThenInclude(pt => pt.Tag)
                .Include(p => p.Favourites)
                .Include(p => p.SharedPost).ThenInclude(sp => sp.User)
                .Include(p => p.SharedPosts)
                .AsNoTracking(); // Không tracking nếu không cần cập nhật

            if (filter == "Friends" && userId != null)
            {
                var friendUserIds = await _dbContext.Friendships
                    .Where(x => x.Status == FriendshipStatus.Friends && (x.RequesterId == userId || x.AddresseeId == userId))
                    .Select(x => x.RequesterId == userId ? x.AddresseeId : x.RequesterId)
                    .ToListAsync();

                query = query.Where(p => friendUserIds.Contains(p.UserId)).OrderByDescending(p => p.CreatedDate);
            }
            else if (filter == "Popular")
            {
                query = query.OrderByDescending(p => p.Likes.Count + p.Comments.Count + p.SharedPosts.Count);
            }
            else
            {
                query = query.OrderByDescending(p => p.CreatedDate);
            }

            Console.WriteLine(query.ToQueryString());

            // Thêm phân trang
            query = query.Skip((page - 1) * pageSize).Take(pageSize);

            var result = await query.Select(p => new GetPostDTO
            {
                Id = p.Id,
                UserId = p.UserId,
                Content = p.Content,
                Images = p.Images,
                Status = p.Status,
                CreatedDate = p.CreatedDate,
                User = new GetUserDTO
                {
                    Id = p.User.Id,
                    FirstName = p.User.FirstName,
                    LastName = p.User.LastName,
                    AvatarUrl = p.User.AvatarUrl,
                },
                Tags = p.PostTags.Select(t => new GetTagDTO { Id = t.Tag.Id, Name = t.Tag.Name }).ToList(),
                Likes = p.Likes.Select(l => new GetLikeDTO { UserId = l.User.Id }).ToList(),
                Favourites = p.Favourites.Select(f => new GetFavouriteDTO { UserId = f.UserId }).ToList(),
                SharedPost = p.SharedPost == null ? null : new GetSharedPostDTO
                {
                    Id = p.SharedPost.Id,
                    Content = p.SharedPost.Deleted ? "This post has been deleted." :
                                  (p.SharedPost.Status == PostStatus.Private ? "This post is not available." : p.SharedPost.Content),
                    Images = p.SharedPost.Deleted || p.SharedPost.Status == PostStatus.Private ? null : p.SharedPost.Images,
                    Status = p.SharedPost.Status,
                    CreatedDate = p.SharedPost.CreatedDate,
                    User = p.SharedPost.Deleted || p.SharedPost.Status == PostStatus.Private ? null : new GetUserDTO
                    {
                        Id = p.Id,
                        FirstName = p.SharedPost.User.FirstName,
                        LastName = p.SharedPost.User.LastName,
                        AvatarUrl = p.SharedPost.User.AvatarUrl,
                    },
                    Tags = p.SharedPost.Deleted || p.SharedPost.Status == PostStatus.Private ? null :  p.SharedPost.PostTags.Select(t => new GetTagDTO { Id = t.Tag.Id, Name = t.Tag.Name }).ToList(),
                },
                SharedCount = p.SharedPosts.Count,
                CommentCount = p.Comments.Count,
            })
            .ToListAsync(); 

            return result;
        }

        public async Task<List<GetPostDTO>> GetAllByUserId(string userId, int page, int pageSize, string visibility)
        {
            IQueryable<Post> query = _dbContext.Posts
                .Where(p => !p.Deleted)
                .AsNoTracking();

            if (visibility == "all")
            {
                query = query.Where(p => p.UserId == userId);
            }
            else if (visibility == "public")
            {
                query = query.Where(p => p.UserId == userId && p.Status == PostStatus.Public);
            }
            else if (visibility == "friend")
            {
                query = query.Where(p => p.UserId == userId && p.Status != PostStatus.Private);
            }

            query = query
                .Include(p => p.User)
                .Include(p => p.Likes)
                .Include(p => p.PostTags).ThenInclude(pt => pt.Tag)
                .Include(p => p.Favourites)
                .Include(p => p.SharedPost).ThenInclude(sp => sp.User);

            Console.WriteLine(query.ToQueryString());

            var result = await query
                .OrderByDescending(p => p.CreatedDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new GetPostDTO
                {
                    Id = p.Id,
                    UserId = p.UserId,
                    Content = p.Content,
                    Images = p.Images,
                    Status = p.Status,
                    CreatedDate = p.CreatedDate,
                    User = new GetUserDTO
                    {
                        Id = p.User.Id,
                        FirstName = p.User.FirstName,
                        LastName = p.User.LastName,
                        AvatarUrl = p.User.AvatarUrl,
                    },
                    Tags = p.PostTags.Select(t => new GetTagDTO { Id = t.Tag.Id, Name = t.Tag.Name }).ToList(),
                    Likes = p.Likes.Select(l => new GetLikeDTO { UserId = l.User.Id }).ToList(),
                    Favourites = p.Favourites.Select(f => new GetFavouriteDTO { UserId = f.UserId }).ToList(),
                    SharedPost = p.SharedPost == null ? null : new GetSharedPostDTO
                    {
                        Id = p.SharedPost.Id,
                        Content = p.SharedPost.Deleted ? "This post has been deleted." :
                                   (p.SharedPost.Status == PostStatus.Private ? "This post is not available." : p.SharedPost.Content),
                        Images = p.SharedPost.Deleted || p.SharedPost.Status == PostStatus.Private ? null : p.SharedPost.Images,
                        Status = p.SharedPost.Status,
                        CreatedDate = p.SharedPost.CreatedDate,
                        User = p.SharedPost.Deleted || p.SharedPost.Status == PostStatus.Private ? null : new GetUserDTO
                        {
                            Id = p.SharedPost.User.Id,
                            FirstName = p.SharedPost.User.FirstName,
                            LastName = p.SharedPost.User.LastName,
                            AvatarUrl = p.SharedPost.User.AvatarUrl,
                        },
                        Tags = p.SharedPost.Deleted || p.SharedPost.Status == PostStatus.Private ? null : p.SharedPost.PostTags.Select(t => new GetTagDTO { Id = t.Tag.Id, Name = t.Tag.Name }).ToList(),
                    },
                    SharedCount = p.SharedPosts.Count(), 
                    CommentCount = _dbContext.Comments.Count(c => c.PostId == p.Id && !c.Deleted), // Đếm số comment mà không Include toàn bộ comments
                })
                .ToListAsync();

            return result;
        }


        public async Task<List<GetPostDTO>> GetAllSaved(string userId, int page, int pageSize)
        {
            var postList = await _dbContext.Posts
                .Where(p => !p.Deleted && p.Favourites.Any(f => f.UserId == userId))
                .OrderByDescending(p => p.CreatedDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new GetPostDTO
                {
                    Id = p.Id,
                    UserId = p.UserId,
                    Content = p.Content,
                    Images = p.Images,
                    Status = p.Status,
                    CreatedDate = p.CreatedDate,
                    User = new GetUserDTO
                    {
                        FirstName = p.User.FirstName,
                        LastName = p.User.LastName,
                        AvatarUrl = p.User.AvatarUrl,
                    },
                    Tags = p.PostTags.Select(t => new GetTagDTO
                    {
                        Id = t.Tag.Id,
                        Name = t.Tag.Name
                    }).ToList(),
                    Likes = p.Likes.Select(l => new GetLikeDTO
                    {
                        UserId = l.User.Id,
                    }).ToList(),
                    Favourites = p.Favourites.Select(f => new GetFavouriteDTO { UserId = f.UserId }).ToList(),
                    SharedPost = p.SharedPost == null ? null : new GetSharedPostDTO
                    {
                        Id = p.SharedPost.Id,
                        Content = p.SharedPost.Deleted ? "This post has been deleted." :
                                  (p.SharedPost.Status == PostStatus.Private ? "This post is not available." : p.SharedPost.Content),
                        Images = p.SharedPost.Deleted || p.SharedPost.Status == PostStatus.Private ? null : p.SharedPost.Images,
                        Status = p.SharedPost.Status,
                        CreatedDate = p.SharedPost.CreatedDate,
                        User = p.SharedPost.Deleted || p.SharedPost.Status == PostStatus.Private ? null : new GetUserDTO
                        {
                            Id = p.Id,
                            FirstName = p.SharedPost.User.FirstName,
                            LastName = p.SharedPost.User.LastName,
                            AvatarUrl = p.SharedPost.User.AvatarUrl,
                        },
                        Tags = p.SharedPost.Deleted || p.SharedPost.Status == PostStatus.Private ? null : p.SharedPost.PostTags.Select(t => new GetTagDTO { Id = t.Tag.Id, Name = t.Tag.Name }).ToList(),
                    },
                    SharedCount = p.SharedPosts.Count,
                    CommentCount = p.Comments.Count,
                    //Favourites = p.Favourites.Select(x => new GetUserFavouritePostDTO { UserId = x.UserId }).ToList(),
                }).ToListAsync();

            return postList;
        }


        public async Task<GetPostDTO> GetById(string Id)
        {
            var postById = await _dbContext.Posts
                .Where(p => p.Id == Id)
                .Select(p => new GetPostDTO
                {
                    Id = p.Id,
                    UserId = p.UserId,
                    Content = p.Content,
                    Images = p.Images,
                    Status = p.Status,
                    CreatedDate = p.CreatedDate,
                    User = new GetUserDTO
                    {
                        FirstName = p.User.FirstName,
                        LastName = p.User.LastName,
                        AvatarUrl = p.User.AvatarUrl,
                        DateOfBirth = p.User.DateOfBirth,
                        UserName = p.User.UserName,
                        Email = p.User.Email,
                        PhoneNumber = p.User.PhoneNumber,
                    },
                    Tags = p.PostTags.Select(t => new GetTagDTO
                    {
                        Id = t.Tag.Id,
                        Name = t.Tag.Name
                    }).ToList(),
                    Likes = p.Likes.Select(l => new GetLikeDTO
                    {
                        UserId = l.User.Id,
                    }).ToList(),
                    //Comments = p.Comments.Select(c => new GetCommentDTO
                    //{
                    //    Id = c.Id,
                    //    User = new GetUserDTO
                    //    {
                    //        Id = c.User.Id,
                    //        FirstName = c.User.FirstName,
                    //        LastName = c.User.LastName,
                    //        AvatarUrl = c.User.AvatarUrl,
                    //        DateOfBirth = c.User.DateOfBirth,
                    //        UserName = c.User.UserName,
                    //        Email = c.User.Email,
                    //        PhoneNumber = c.User.PhoneNumber,
                    //    },
                    //    ParentId = c.ParentId,
                    //    Content = c.Content,
                    //    CreatedDate = c.CreatedDate,
                    //    UpdatedDate = c.UpdatedDate,
                    //    Deleted = c.Deleted,
                    //    DeletedDate = c.DeletedDate
                    //}).Where(x => x.Deleted == false).OrderByDescending(x => x.CreatedDate).ToList(),
                    CommentCount = _dbContext.Comments.Where(c => !c.Deleted).Count(c => c.PostId == p.Id),
                }).SingleOrDefaultAsync();


            return postById;
        }

        public async Task<GetPostDTO> Add(AddPostDTO postDTO)
        {
            var postNew = _mapper.Map<Post>(postDTO);

            await _dbContext.Posts.AddAsync(postNew);
            await _dbContext.SaveChangesAsync();

            if (postDTO.Tags.Count > 0)
            {
                await _postTagRepository.Add(postDTO.Tags, postNew.Id);
            }

            var postNewById = await GetById(postNew.Id);

            return postNewById;
        }

        public async Task<GetPostDTO> Update(UpdatePostDTO postDTO)
        {
            var post = await _dbContext.Posts.SingleOrDefaultAsync(p => p.Id == postDTO.Id);

            if (post == null)
            {
                throw new Exception("Post not found");
            }

            if (post.UserId != postDTO.UserId)
            {
                throw new UnauthorizedAccessException("You are not allowed to update this post");
            }

            _mapper.Map(postDTO, post);
            await _dbContext.SaveChangesAsync();

            await _postTagRepository.Delete(post.Id);
            if (postDTO.Tags != null)
            {
                await _postTagRepository.Add(postDTO.Tags, postDTO.Id);
            }

            var postNewById = await GetById(post.Id);

            return postNewById;
        }

        public async Task<bool> Delete(string id, string userId)
        {
            var post = await _dbContext.Posts.SingleOrDefaultAsync(pt => pt.Id == id);

            if (post == null)
            {
                return false;
            }

            if (post.UserId != userId)
            {
                throw new UnauthorizedAccessException("You are not allowed to update this post");
            }


            post.Deleted = true;
            post.DeletedDate = DateTime.UtcNow;
            await _dbContext.SaveChangesAsync();

            return true;
        }

        public async Task<string> ChangeLike(ChangeLikeDTO likeDTO)
        {
            var result = await _dbContext.Likes.SingleOrDefaultAsync(l => l.UserId == likeDTO.UserId && l.PostId == likeDTO.PostId);
            if (result != null)
            {
                _dbContext.Likes.Remove(result);
                await _dbContext.SaveChangesAsync();

                return "Unlike";
            }
            else
            {
                var like = _mapper.Map<Like>(likeDTO);
                await _dbContext.Likes.AddAsync(like);
                await _dbContext.SaveChangesAsync();

                return "Liked";

            }

        }

        public async Task<string> Save(FavouritePostDTO favouriteDT0)
        {
            var favouriteNew = _mapper.Map<Favourite>(favouriteDT0);
            await _dbContext.AddAsync(favouriteNew);
            await _dbContext.SaveChangesAsync();

            return favouriteNew.UserId;
        }

        public async Task<string> UnSave(FavouritePostDTO favouriteDT0)
        {
            var favourite = await _dbContext.Favourites.SingleOrDefaultAsync(x => x.UserId == favouriteDT0.UserId && x.PostId == favouriteDT0.PostId);

            _dbContext.Favourites.Remove(favourite);
            await _dbContext.SaveChangesAsync();

            return favourite.UserId;
        }
    }
}
