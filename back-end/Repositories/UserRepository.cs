using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using SocialNetwork.Data;
using SocialNetwork.Helpers;
using SocialNetwork.Models.Domain;
using SocialNetwork.Models.DTO.FriendshipDTO;
using SocialNetwork.Models.DTO.LikeDTO;
using SocialNetwork.Models.DTO.MessageDTO;
using SocialNetwork.Models.DTO.PostDTO;
using SocialNetwork.Models.DTO.TagDTO;
using SocialNetwork.Models.DTO.UserDTO;
using System.Linq;
using System.Net.WebSockets;

namespace SocialNetwork.Repositories
{
    public interface IUserRepository
    {
        public Task<GetUserWithFriendByIdDTO> GetById(string userId, string id);
        public Task<UpdateProfileInfoDTO> UpdateProfileInfo(string userId, UpdateProfileInfoDTO userDTO);
        public Task<UpdateProfileDetailDTO> UpdateProfileDetail(string userId, UpdateProfileDetailDTO profileDTO);
        public Task<FriendshipStatus> GetStatusFriend(string currentUserId, string userId);
        public Task<bool> ChangeStatusFriend(ChangeStatusFriendDTO changeStatusFriendDTO);
        public Task<List<GetFriendshipWithLastMsgDTO>> GetListFriendShip(string id);
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

        public async Task<GetUserWithFriendByIdDTO> GetById(string userId, string id)
        {
            var userById = await _socialNetworkDbContext.Users
                .Where(u => u.Id == id)
                .Select(u => new GetUserWithFriendByIdDTO
                {
                    Id = u.Id,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    AvatarUrl = u.AvatarUrl,
                    Status = userId != id ? _socialNetworkDbContext.Friendships
                         .AsQueryable()
                         .Where(f => (f.AddresseeId == userId && f.RequesterId == id) ||
                                     (f.AddresseeId == id && f.RequesterId == userId))
                         .Select(f => f.Status).FirstOrDefault() : null,
                    UserProfile = new GetUserProfileDTO
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

                    },
                    Friends =  _socialNetworkDbContext.Friendships
                        .Where(f => f.Status == FriendshipStatus.Friends && (f.RequesterId == id || f.AddresseeId == id))
                        .Select(f => f.RequesterId == id
                            ? new GetFriendDTO
                            {
                                Id = f.Addressee.Id,
                                FirstName = f.Addressee.FirstName,
                                LastName = f.Addressee.LastName,
                                AvatarUrl = f.Addressee.AvatarUrl
                            }
                            : new GetFriendDTO
                            {
                                Id = f.Requester.Id,
                                FirstName = f.Requester.FirstName,
                                LastName = f.Requester.LastName,
                                AvatarUrl = f.Requester.AvatarUrl
                            })
                        .ToList()
                }).SingleOrDefaultAsync();

            return userById;
        }

        public async Task<UpdateProfileDetailDTO> UpdateProfileDetail(string userId, UpdateProfileDetailDTO profileDTO)
        {
            var profile = await _socialNetworkDbContext.UserProfiles.SingleOrDefaultAsync(up => up.UserId == userId);

            if (profile == null) return null;

            _mapper.Map(profileDTO, profile);
          
            await _socialNetworkDbContext.SaveChangesAsync();
            return profileDTO;
        }

        public async Task<UpdateProfileInfoDTO> UpdateProfileInfo(string userId, UpdateProfileInfoDTO userDTO)
        {
            var user = await _socialNetworkDbContext.Users.Include(u => u.UserProfile).SingleOrDefaultAsync(u => u.Id == userId);

            if (user == null || user.UserProfile == null)
                return null;

            user.FirstName = userDTO.FirstName;
            user.LastName = userDTO.LastName;
            user.AvatarUrl = userDTO.AvatarUrl;
            user.UserProfile.CoverPhotoUrl = userDTO.CoverPhotoUrl;

            await _socialNetworkDbContext.SaveChangesAsync();
            return userDTO;
        }

        public async Task<FriendshipStatus> GetStatusFriend(string currentUserId, string userId)
        {
            var friendShip = await _socialNetworkDbContext.Friendships.SingleOrDefaultAsync(x => x.RequesterId == currentUserId && x.AddresseeId == userId || x.RequesterId == userId && x.AddresseeId == currentUserId);

            if(friendShip != null)
            {
                return friendShip.Status;
            }

            return FriendshipStatus.NotFriends;
        }

        public async Task<bool> ChangeStatusFriend(ChangeStatusFriendDTO changeStatusFriendDTO)
        {
            if(changeStatusFriendDTO.Status == 0)
            {
                var findfriendShip = await _socialNetworkDbContext.Friendships.SingleOrDefaultAsync(x => x.RequesterId == changeStatusFriendDTO.UserId && x.AddresseeId == changeStatusFriendDTO.FriendId || x.RequesterId == changeStatusFriendDTO.FriendId && x.AddresseeId == changeStatusFriendDTO.UserId);

                 _socialNetworkDbContext.Friendships.Remove(findfriendShip);
                await _socialNetworkDbContext.SaveChangesAsync();
                return true;
            }
            else if (changeStatusFriendDTO.Status == 1)
            {
                var friendShip = new Friendship()
                {
                    RequesterId = changeStatusFriendDTO.UserId,
                    AddresseeId = changeStatusFriendDTO.FriendId,
                    Status = (FriendshipStatus)changeStatusFriendDTO.Status,
                    RequestDate = DateTime.Now,
                };
                await _socialNetworkDbContext.Friendships.AddAsync(friendShip);
                await _socialNetworkDbContext.SaveChangesAsync();

                return true;
            }  
            else if (changeStatusFriendDTO.Status == 2)
            {
                var findfriendShip = await _socialNetworkDbContext.Friendships.SingleOrDefaultAsync(x => x.RequesterId == changeStatusFriendDTO.UserId && x.AddresseeId == changeStatusFriendDTO.FriendId || x.RequesterId == changeStatusFriendDTO.FriendId && x.AddresseeId == changeStatusFriendDTO.UserId);

                findfriendShip.Status = FriendshipStatus.Friends;
                findfriendShip.AcceptDate = DateTime.Now;

                await _socialNetworkDbContext.SaveChangesAsync();
                return true;
            }
            else if (changeStatusFriendDTO.Status == 3)
            {
                var findfriendShip = await _socialNetworkDbContext.Friendships.SingleOrDefaultAsync(x => x.RequesterId == changeStatusFriendDTO.UserId && x.AddresseeId == changeStatusFriendDTO.FriendId);

                findfriendShip.Status = FriendshipStatus.Blocked;

                await _socialNetworkDbContext.SaveChangesAsync();
                return true;
            }
            else
            {
                return false;
            }
            
        }

        public async Task<List<GetFriendshipWithLastMsgDTO>> GetListFriendShip(string userId)
        {
            //var friendIds = await _socialNetworkDbContext.Friendships
            // .Where(x => x.Status == FriendshipStatus.Friends && (x.RequesterId == userId || x.AddresseeId == userId))
            // .Select(x => x.RequesterId == userId ? x.AddresseeId : x.RequesterId) // Lấy ID của bạn bè
            // .ToListAsync();

            //// Nếu không có bạn bè thì return danh sách rỗng
            //if (!friendIds.Any()) return new List<GetFriendshipWithLastMsgDTO>(); 

            //var friends = await _socialNetworkDbContext.Users
            //    .Include(x => x.UserProfile)
            //    .Where(x => friendIds.Contains(x.Id))
            //    .ProjectTo<GetFriendshipWithLastMsgDTO>(_mapper.ConfigurationProvider) // Sử dụng AutoMapper
            //    .ToListAsync();

#pragma warning disable CS8601 // Possible null reference assignment.
            var friends = await _socialNetworkDbContext.Users
                .Where(user => _socialNetworkDbContext.Friendships
                    .Where(f => f.Status == FriendshipStatus.Friends &&
                                (f.RequesterId == userId || f.AddresseeId == userId))
                    .Select(f => f.RequesterId == userId ? f.AddresseeId : f.RequesterId)
                    .Contains(user.Id))
                .Select(user => new GetFriendshipWithLastMsgDTO
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    AvatarUrl = user.AvatarUrl,
                    UserProfile = _mapper.Map<GetUserProfileDTO>(user.UserProfile),
                    LastMessage = _socialNetworkDbContext.Messages
                        .Where(m => (m.SenderId == userId && m.ReceiverId == user.Id) ||
                                    (m.SenderId == user.Id && m.ReceiverId == userId))
                        .OrderByDescending(m => m.CreatedDate) // Sắp xếp ngay trong SQL
                        .Select(m => new GetMessageDTO
                        {
                            Id = m.Id,
                            SenderId = m.SenderId,
                            ReceiverId = m.ReceiverId,
                            Content = m.Content,
                            ImageUrl = m.ImageUrl,
                            IsSeen = m.IsSeen,
                            CreatedDate = m.CreatedDate,
                        })
                        .FirstOrDefault()
                })
                .OrderByDescending(f => f.LastMessage.CreatedDate) // Sắp xếp ngay trong database
                .ToListAsync(); // Lấy dữ liệu sau khi đã sắp xếp xong
#pragma warning restore CS8601 // Possible null reference assignment.

            return friends;

        }

    }
}
