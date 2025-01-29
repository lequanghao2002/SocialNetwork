using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Data;
using SocialNetwork.Helpers;
using SocialNetwork.Models.Domain;
using SocialNetwork.Models.DTO.CommentDTO;
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
        public Task<List<GetPostDTO>> GetAll(string filter, string? userId, int page, int pageSize);
        public Task<List<GetPostDTO>> GetAllByUserId(string userId, int page, int pageSize);
        public Task<List<GetPostDTO>> GetAllPostSaveByUserId(string userId, int page, int pageSize);
        public Task<GetPostDTO> GetById(string Id);
        public Task<GetPostDTO> Add(AddPostDTO postDTO);
        public Task<GetPostDTO> Update(UpdatePostDTO postDTO);
        public Task<bool> Delete(string Id);
        public Task<string> ChangeLike(GetLikeDTO likeDTO);
        public Task<int> CountShared(string id);
        public Task<GetPostDTO> Save(FavouritePostDTO favouriteDT0);

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
                    SharedPostId = p.SharedPostId,
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
                    ListTag = p.PostTags.Select(t => new GetTagDTO
                    {
                        Id = t.Tag.Id,
                        Name = t.Tag.Name
                    }).ToList(),
                    Likes = p.Likes.Select(l => new GetLikeDTO
                    {
                        UserId = l.User.Id,
                        PostId = l.PostId,
                    }).ToList(),
                    Comments = p.Comments.Select(c => new GetCommentDTO
                    {
                        Id = c.Id,
                        User = new GetUserDTO
                        {
                            Id = c.User.Id,
                            FirstName = c.User.FirstName,
                            LastName = c.User.LastName,
                            AvatarUrl = c.User.AvatarUrl,
                            DateOfBirth = c.User.DateOfBirth,
                            UserName = c.User.UserName,
                            Email = c.User.Email,
                            PhoneNumber = c.User.PhoneNumber,
                        },
                        ParentId = c.ParentId,
                        Content = c.Content,
                        CreatedDate = c.CreatedDate,
                        UpdatedDate = c.UpdatedDate,
                        Deleted = c.Deleted,
                        DeletedDate = c.DeletedDate
                    }).Where(x => x.Deleted == false).OrderByDescending(o => o.CreatedDate).ToList(),
                    UsersFavourite = p.Favourites.Select(x => new GetUserFavouritePostDTO { UserId = x.UserId }).ToList()

                }).ToListAsync();


            return postList;
        }

        public async Task<List<GetPostDTO>> GetAll(string filter, string? userId, int page, int pageSize)
        {

            if (filter == "Friends" && userId != null)
            {
                var lstFriendship = await _dbContext.Friendships
                    .Where(x => x.status == FriendshipStatus.Friend && (x.UserId == userId || x.FriendId == userId))
                    .ToListAsync();

                var friendUserIds = lstFriendship
                   .Select(x => x.UserId == userId ? x.FriendId : x.UserId)
                   .Distinct()
                   .ToList();

                var postList = await _dbContext.Posts
                .Where(p => friendUserIds.Contains(p.UserId) && p.Deleted == false && p.Status != PostStatus.Private)
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
                    SharedPostId = p.SharedPostId,
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
                    ListTag = p.PostTags.Select(t => new GetTagDTO
                    {
                        Id = t.Tag.Id,
                        Name = t.Tag.Name
                    }).ToList(),
                    Likes = p.Likes.Select(l => new GetLikeDTO
                    {
                        UserId = l.User.Id,
                        PostId = l.PostId,
                    }).ToList(),
                    Comments = p.Comments.Select(c => new GetCommentDTO
                    {
                        Id = c.Id,
                        User = new GetUserDTO
                        {
                            Id = c.User.Id,
                            FirstName = c.User.FirstName,
                            LastName = c.User.LastName,
                            AvatarUrl = c.User.AvatarUrl,
                            DateOfBirth = c.User.DateOfBirth,
                            UserName = c.User.UserName,
                            Email = c.User.Email,
                            PhoneNumber = c.User.PhoneNumber,
                        },
                        ParentId = c.ParentId,
                        Content = c.Content,
                        CreatedDate = c.CreatedDate,
                        UpdatedDate = c.UpdatedDate,
                        Deleted = c.Deleted,
                        DeletedDate = c.DeletedDate
                    }).Where(x => x.Deleted == false).OrderByDescending(o => o.CreatedDate).ToList(),
                    UsersFavourite = p.Favourites.Select(x => new GetUserFavouritePostDTO { UserId = x.UserId }).ToList()

                }).ToListAsync();

                return postList;
            } else if (filter == "Popular")
            {
                var postList = await _dbContext.Posts
                .Where(p => p.Deleted == false && p.Status != PostStatus.Private)
                .OrderByDescending(p => p.Likes.Count + p.Comments.Count + _dbContext.Posts.Count(sp => sp.SharedPostId == p.Id))
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new GetPostDTO
                {
                    Id = p.Id,
                    UserId = p.UserId,
                    Content = p.Content,
                    Images = p.Images,
                    Status = p.Status,
                    SharedPostId = p.SharedPostId,
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
                    ListTag = p.PostTags.Select(t => new GetTagDTO
                    {
                        Id = t.Tag.Id,
                        Name = t.Tag.Name
                    }).ToList(),
                    Likes = p.Likes.Select(l => new GetLikeDTO
                    {
                        UserId = l.User.Id,
                        PostId = l.PostId,
                    }).ToList(),
                    Comments = p.Comments.Select(c => new GetCommentDTO
                    {
                        Id = c.Id,
                        User = new GetUserDTO
                        {
                            Id = c.User.Id,
                            FirstName = c.User.FirstName,
                            LastName = c.User.LastName,
                            AvatarUrl = c.User.AvatarUrl,
                            DateOfBirth = c.User.DateOfBirth,
                            UserName = c.User.UserName,
                            Email = c.User.Email,
                            PhoneNumber = c.User.PhoneNumber,
                        },
                        ParentId = c.ParentId,
                        Content = c.Content,
                        CreatedDate = c.CreatedDate,
                        UpdatedDate = c.UpdatedDate,
                        Deleted = c.Deleted,
                        DeletedDate = c.DeletedDate
                    }).Where(x => x.Deleted == false).OrderByDescending(o => o.CreatedDate).ToList(),
                    UsersFavourite = p.Favourites.Select(x => new GetUserFavouritePostDTO { UserId = x.UserId }).ToList()

                }).ToListAsync();

                return postList;
            }
            else 
            {
                var postList = await _dbContext.Posts
                .Where(p => p.Deleted == false && p.Status != PostStatus.Private)
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
                    SharedPostId = p.SharedPostId,
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
                    ListTag = p.PostTags.Select(t => new GetTagDTO
                    {
                        Id = t.Tag.Id,
                        Name = t.Tag.Name
                    }).ToList(),
                    Likes = p.Likes.Select(l => new GetLikeDTO
                    {
                        UserId = l.User.Id,
                        PostId = l.PostId,
                    }).ToList(),
                    Comments = p.Comments.Select(c => new GetCommentDTO
                    {
                        Id = c.Id,
                        User = new GetUserDTO
                        {
                            Id = c.User.Id,
                            FirstName = c.User.FirstName,
                            LastName = c.User.LastName,
                            AvatarUrl = c.User.AvatarUrl,
                            DateOfBirth = c.User.DateOfBirth,
                            UserName = c.User.UserName,
                            Email = c.User.Email,
                            PhoneNumber = c.User.PhoneNumber,
                        },
                        ParentId = c.ParentId,
                        Content = c.Content,
                        CreatedDate = c.CreatedDate,
                        UpdatedDate = c.UpdatedDate,
                        Deleted = c.Deleted,
                        DeletedDate = c.DeletedDate
                    }).Where(x => x.Deleted == false).OrderByDescending(o => o.CreatedDate).ToList(),
                    UsersFavourite = p.Favourites.Select(x => new GetUserFavouritePostDTO { UserId = x.UserId }).ToList()

                }).ToListAsync();

                return postList;
            }

        }

        public async Task<List<GetPostDTO>> GetAllByUserId(string userId, int page, int pageSize)
        {
            var postList = await _dbContext.Posts
                .Where(p => p.Deleted == false && p.UserId == userId)
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
                    SharedPostId = p.SharedPostId,
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
                    ListTag = p.PostTags.Select(t => new GetTagDTO
                    {
                        Id = t.Tag.Id,
                        Name = t.Tag.Name
                    }).ToList(),
                    Likes = p.Likes.Select(l => new GetLikeDTO
                    {
                        UserId = l.User.Id,
                        PostId = l.PostId,
                    }).ToList(),
                    Comments = p.Comments.Select(c => new GetCommentDTO
                    {
                        Id = c.Id,
                        User = new GetUserDTO
                        {
                            Id = c.User.Id,
                            FirstName = c.User.FirstName,
                            LastName = c.User.LastName,
                            AvatarUrl = c.User.AvatarUrl,
                            DateOfBirth = c.User.DateOfBirth,
                            UserName = c.User.UserName,
                            Email = c.User.Email,
                            PhoneNumber = c.User.PhoneNumber,
                        },
                        ParentId = c.ParentId,
                        Content = c.Content,
                        CreatedDate = c.CreatedDate,
                        UpdatedDate = c.UpdatedDate,
                        Deleted = c.Deleted,
                        DeletedDate = c.DeletedDate
                    }).Where(x => x.Deleted == false).OrderByDescending(x => x.CreatedDate).ToList(),
                    UsersFavourite = p.Favourites.Select(x => new GetUserFavouritePostDTO { UserId = x.UserId }).ToList()

                }).ToListAsync();


            return postList;
        }

        public async Task<List<GetPostDTO>> GetAllPostSaveByUserId(string userId, int page, int pageSize)
        {
            var postSaveList = await _dbContext.Favourites
                .Where(x => x.UserId == userId)
                .Select(x => x.PostId)
                .ToListAsync();

            var postList = await _dbContext.Posts
                .Where(p => postSaveList.Contains(p.Id) && p.Deleted == false)
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
                    SharedPostId = p.SharedPostId,
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
                    ListTag = p.PostTags.Select(t => new GetTagDTO
                    {
                        Id = t.Tag.Id,
                        Name = t.Tag.Name
                    }).ToList(),
                    Likes = p.Likes.Select(l => new GetLikeDTO
                    {
                        UserId = l.User.Id,
                        PostId = l.PostId,
                    }).ToList(),
                    Comments = p.Comments.Select(c => new GetCommentDTO
                    {
                        Id = c.Id,
                        User = new GetUserDTO
                        {
                            Id = c.User.Id,
                            FirstName = c.User.FirstName,
                            LastName = c.User.LastName,
                            AvatarUrl = c.User.AvatarUrl,
                            DateOfBirth = c.User.DateOfBirth,
                            UserName = c.User.UserName,
                            Email = c.User.Email,
                            PhoneNumber = c.User.PhoneNumber,
                        },
                        ParentId = c.ParentId,
                        Content = c.Content,
                        CreatedDate = c.CreatedDate,
                        UpdatedDate = c.UpdatedDate,
                        Deleted = c.Deleted,
                        DeletedDate = c.DeletedDate
                    }).Where(x => x.Deleted == false).OrderByDescending(x => x.CreatedDate).ToList(),
                    UsersFavourite = p.Favourites.Select(x => new GetUserFavouritePostDTO { UserId = x.UserId }).ToList()

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
                    SharedPostId = p.SharedPostId,
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
                    ListTag = p.PostTags.Select(t => new GetTagDTO
                    {
                        Id = t.Tag.Id,
                        Name = t.Tag.Name
                    }).ToList(),
                    Likes = p.Likes.Select(l => new GetLikeDTO
                    {
                        UserId = l.User.Id,
                        PostId = l.PostId,
                    }).ToList(),
                    Comments = p.Comments.Select(c => new GetCommentDTO
                    {
                        Id = c.Id,
                        User = new GetUserDTO
                        {
                            Id = c.User.Id,
                            FirstName = c.User.FirstName,
                            LastName = c.User.LastName,
                            AvatarUrl = c.User.AvatarUrl,
                            DateOfBirth = c.User.DateOfBirth,
                            UserName = c.User.UserName,
                            Email = c.User.Email,
                            PhoneNumber = c.User.PhoneNumber,
                        },
                        ParentId = c.ParentId,
                        Content = c.Content,
                        CreatedDate = c.CreatedDate,
                        UpdatedDate = c.UpdatedDate,
                        Deleted = c.Deleted,
                        DeletedDate = c.DeletedDate
                    }).Where(x => x.Deleted == false).OrderByDescending(x => x.CreatedDate).ToList(),
                }).SingleOrDefaultAsync();


            return postById;
        }

        public async Task<GetPostDTO> Add(AddPostDTO postDTO)
        {
            var postNew = _mapper.Map<Post>(postDTO);
            postNew.Id = Guid.NewGuid().ToString();

            if (postDTO.FileList != null)
            {
                postNew.Images = await HandleUpload.UploadImages(postDTO.FileList);
            }

            await _dbContext.Posts.AddAsync(postNew);
            await _dbContext.SaveChangesAsync();

            if (postDTO.TagList != null)
            {
                await _postTagRepository.Add(postDTO.TagList, postNew.Id);
            }

            var postNewById = await GetById(postNew.Id);

            return postNewById;
        }

        public async Task<GetPostDTO> Update(UpdatePostDTO postDTO)
        {
            //var postUpdate = _mapper.Map<Post>(postDTO);
            var postUpdate = await _dbContext.Posts.SingleOrDefaultAsync(p => p.Id == postDTO.Id);
            postUpdate.Content = postDTO.Content;
            postUpdate.Status = postDTO.Status;

            postUpdate.Images = "";
            if (postDTO.FileList != null)
            {
                postUpdate.Images = await HandleUpload.UploadImages(postDTO.FileList);
            }
            await _dbContext.SaveChangesAsync();

            await _postTagRepository.Delete(postUpdate.Id);
            if (postDTO.TagList != null)
            {
                await _postTagRepository.Add(postDTO.TagList, postDTO.Id);
            }

            var postNewById = await GetById(postUpdate.Id);

            return postNewById;
        }

        public async Task<bool> Delete(string Id)
        {
            var postDelete = await _dbContext.Posts.SingleOrDefaultAsync(pt => pt.Id == Id);

            postDelete.Deleted = true;
            postDelete.CreatedDate = DateTime.UtcNow;
            await _dbContext.SaveChangesAsync();

            return true;
        }

        public async Task<string> ChangeLike(GetLikeDTO likeDTO)
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

        public async Task<int> CountShared(string id)
        {
            var count = await _dbContext.Posts.Where(p => p.SharedPostId == id && p.Deleted == false).CountAsync();

            return count;
        }

        public async Task<GetPostDTO> Save(FavouritePostDTO favouriteDT0)
        {
            var findFavourite = await _dbContext.Favourites.SingleOrDefaultAsync(x => x.UserId == favouriteDT0.UserId && x.PostId == favouriteDT0.PostId);

            if (findFavourite != null)
            {
                _dbContext.Remove(findFavourite);
                await _dbContext.SaveChangesAsync();

                var postNewById = await GetById(findFavourite.PostId);
                return postNewById;
            }
            else
            {
                var favouriteNew = _mapper.Map<Favourite>(favouriteDT0);
                await _dbContext.AddAsync(favouriteNew);
                await _dbContext.SaveChangesAsync();

                var postNewById = await GetById(favouriteNew.PostId);
                return postNewById;
            }




        }
    }
}
