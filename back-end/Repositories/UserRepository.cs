using AutoMapper;
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Data;
using SocialNetwork.Helpers;
using SocialNetwork.Models.Domain;
using SocialNetwork.Models.DTO.LikeDTO;
using SocialNetwork.Models.DTO.PostDTO;
using SocialNetwork.Models.DTO.TagDTO;
using SocialNetwork.Models.DTO.UserDTO;
using System.Net.WebSockets;

namespace SocialNetwork.Repositories
{
    public interface IUserRepository
    {
        public Task<GetUserByIdDTO> GetById(string id);
        public Task<bool> UpdateUserProfile(UpdateUserProfileDTO profileDTO);
        public Task<bool> UpdateUser(UpdateUserDTO userDTO);
        public Task<Friendship> GetStatusFriend(string userId, string friendId);
        public Task<bool> ChangeStatusFriend(ChangeStatusFriendDTO changeStatusFriendDTO);
        public Task<List<GetFriendshipDTO>> GetListFriendShip(string id);
    }

    public class UserRepository : IUserRepository
    {
        private readonly SocialNetworkDbContext _socialNetworkDbContext;
        private readonly IMapper _mapper;

        public UserRepository(SocialNetworkDbContext socialNetworkDbContext, IMapper mapper)
        {
            _socialNetworkDbContext = socialNetworkDbContext;
            _mapper = mapper;
        }

        public async Task<GetUserByIdDTO> GetById(string id)
        {
            var userById = await _socialNetworkDbContext.Users
                .Where(u => u.Id == id)
                .Select(u => new GetUserByIdDTO
                {
                    Id = u.Id,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    AvatarUrl = u.AvatarUrl,
                    DateOfBirth = u.DateOfBirth,
                    CreatedDate = u.CreatedDate,
                    UserProfile = u.UserProfile != null ? new GetUserProfileDTO
                    {
                        CoverPhotoUrl = u.UserProfile.CoverPhotoUrl,
                        Introduce = u.UserProfile.Introduce,
                        LiveAt = u.UserProfile.LiveAt,
                        StudyAt = u.UserProfile.StudyAt,
                        WorkingAt = u.UserProfile.WorkingAt,
                        IsActive = u.UserProfile.IsActive,
                        Github = u.UserProfile.Github,
                        Facebook = u.UserProfile.Facebook,
                        LinkedIn = u.UserProfile.LinkedIn,

                    }
                    : null,
                }).SingleOrDefaultAsync();

            return userById;
        }

        public async Task<bool> UpdateUserProfile(UpdateUserProfileDTO profileDTO)
        {
            var userProfileUpdate = await _socialNetworkDbContext.UserProfiles.SingleOrDefaultAsync(up => up.UserId == profileDTO.UserId);

            if (userProfileUpdate != null)
            {
                userProfileUpdate.Introduce = profileDTO.Introduce;
                userProfileUpdate.LiveAt = profileDTO.LiveAt;
                userProfileUpdate.StudyAt = profileDTO.StudyAt;
                userProfileUpdate.WorkingAt = profileDTO.WorkingAt;
                userProfileUpdate.Github = profileDTO.Github;
                userProfileUpdate.Facebook = profileDTO.Facebook;
                userProfileUpdate.LinkedIn = profileDTO.LinkedIn;
            }
            else
            {
                var UserProfilesNew = _mapper.Map<UserProfile>(profileDTO);

                await _socialNetworkDbContext.AddAsync(UserProfilesNew);
            }



            await _socialNetworkDbContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateUser(UpdateUserDTO userDTO)
        {
            var user = await _socialNetworkDbContext.Users.SingleOrDefaultAsync(u => u.Id == userDTO.Id);
            var userProfile = await _socialNetworkDbContext.UserProfiles.SingleOrDefaultAsync(u => u.UserId == userDTO.Id);

            if (user != null)
            {
                user.FirstName = userDTO.FirstName;
                user.LastName = userDTO.LastName;

                if(userDTO.AvatarUrl != null) {
                    var avatarUrl = await HandleUpload.UploadImage(userDTO.AvatarUrl);
                    user.AvatarUrl = avatarUrl;
                }
                
                if(userDTO.CoverPhotoUrl != null)
                {
                        var coverPhotoUrl = await HandleUpload.UploadImage(userDTO.CoverPhotoUrl);
                    if (userProfile != null)
                    {
                        userProfile.CoverPhotoUrl = coverPhotoUrl;
                    }
                    else {
                        var userProfileNew = new UserProfile
                        {
                            UserId = userDTO.Id,
                            CoverPhotoUrl = coverPhotoUrl,
                        };

                        await _socialNetworkDbContext.AddAsync(userProfileNew);
                    }

                    
                }

                await _socialNetworkDbContext.SaveChangesAsync();
                return true;
            }
           else
            {
                return false;
            }

          
        }

        public async Task<Friendship> GetStatusFriend(string userId, string friendId)
        {
            var friendShip = await _socialNetworkDbContext.Friendships.SingleOrDefaultAsync(x => x.UserId == userId && x.FriendId == friendId || x.UserId == friendId && x.FriendId == userId);

            if(friendShip != null)
            {
                return friendShip;

            }

            var not = new Friendship()
            {
                status = 0,
            };

            return not;

        }

        public async Task<bool> ChangeStatusFriend(ChangeStatusFriendDTO changeStatusFriendDTO)
        {
            if(changeStatusFriendDTO.Status == 0)
            {
                var findfriendShip = await _socialNetworkDbContext.Friendships.SingleOrDefaultAsync(x => x.UserId == changeStatusFriendDTO.UserId && x.FriendId == changeStatusFriendDTO.FriendId || x.UserId == changeStatusFriendDTO.FriendId && x.FriendId == changeStatusFriendDTO.UserId);

                 _socialNetworkDbContext.Friendships.Remove(findfriendShip);
                await _socialNetworkDbContext.SaveChangesAsync();
                return true;
            }
            else if (changeStatusFriendDTO.Status == 1)
            {
                var friendShip = new Friendship()
                {
                    UserId = changeStatusFriendDTO.UserId,
                    FriendId = changeStatusFriendDTO.FriendId,
                    status = (FriendshipStatus)changeStatusFriendDTO.Status,
                    RequestDate = DateTime.Now,
                };
                await _socialNetworkDbContext.Friendships.AddAsync(friendShip);
                await _socialNetworkDbContext.SaveChangesAsync();

                return true;
            }  
            else if (changeStatusFriendDTO.Status == 2)
            {
                var findfriendShip = await _socialNetworkDbContext.Friendships.SingleOrDefaultAsync(x => x.UserId == changeStatusFriendDTO.UserId && x.FriendId == changeStatusFriendDTO.FriendId || x.UserId == changeStatusFriendDTO.FriendId && x.FriendId == changeStatusFriendDTO.UserId);

                findfriendShip.status = FriendshipStatus.Friend;
                findfriendShip.AcceptDate = DateTime.Now;

                await _socialNetworkDbContext.SaveChangesAsync();
                return true;
            }
            else if (changeStatusFriendDTO.Status == 3)
            {
                var findfriendShip = await _socialNetworkDbContext.Friendships.SingleOrDefaultAsync(x => x.UserId == changeStatusFriendDTO.UserId && x.FriendId == changeStatusFriendDTO.FriendId);

                findfriendShip.status = FriendshipStatus.Blocked;

                await _socialNetworkDbContext.SaveChangesAsync();
                return true;
            }
            else
            {
                return false;
            }
            
        }

        public async Task<List<GetFriendshipDTO>> GetListFriendShip(string id)
        {
            var lstFriendshipById = await _socialNetworkDbContext.Friendships
                .Where(x => x.status == FriendshipStatus.Friend && (x.UserId == id || x.FriendId == id))
                .ToListAsync();

            List<GetFriendshipDTO> lstUserDTO = new List<GetFriendshipDTO>();

            foreach (var item in lstFriendshipById)
            {
                var userQuery = _socialNetworkDbContext.Users
                    .Include(x => x.UserProfile) // Đảm bảo UserProfile được load
                    .Where(x => x.Id == (item.UserId == id ? item.FriendId : item.UserId))
                    .Select(x => new GetFriendshipDTO
                    {
                        Id = x.Id,
                        FirstName = x.FirstName,
                        LastName = x.LastName,
                        AvatarUrl = x.AvatarUrl,
                        UserProfile = new GetUserProfileDTO
                        {
                            CoverPhotoUrl = x.UserProfile.CoverPhotoUrl,
                            Introduce = x.UserProfile.Introduce,
                            LiveAt = x.UserProfile.LiveAt,
                            StudyAt = x.UserProfile.StudyAt,
                            WorkingAt = x.UserProfile.WorkingAt,
                            Github = x.UserProfile.Github,
                            Facebook = x.UserProfile.Facebook,
                            LinkedIn = x.UserProfile.LinkedIn,
                            IsActive = x.UserProfile.IsActive,
                        }
                    });

                var userNew = await userQuery.FirstOrDefaultAsync(); // Sử dụng FirstOrDefault để tránh null

                if (userNew != null)
                {
                    lstUserDTO.Add(userNew);
                }
            }

            return lstUserDTO;
        }

    }
}
