using AutoMapper;
using SocialNetwork.Models.Domain;
using SocialNetwork.Models.DTO.AuthDTO;
using SocialNetwork.Models.DTO.CommentDTO;
using SocialNetwork.Models.DTO.LikeDTO;
using SocialNetwork.Models.DTO.MessageDTO;
using SocialNetwork.Models.DTO.PostDTO;
using SocialNetwork.Models.DTO.TagDTO;
using SocialNetwork.Models.DTO.UserDTO;
using SocialNetwork.Models.Entities;

namespace SocialNetwork.Helpers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<AddPostDTO, Post>()
                .ForMember(dest => dest.CreatedDate, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.UpdatedDate, opt => opt.MapFrom(src => (DateTime?)null)) 
                .ForMember(dest => dest.Deleted, opt => opt.MapFrom(src => false))
                .ForMember(dest => dest.DeletedDate, opt => opt.MapFrom(src => (DateTime?)null));
            CreateMap<Post, GetPostDTO>().ReverseMap();

            CreateMap<Tag, GetTagDTO>().ReverseMap();
            CreateMap<Tag, AddTagDTO>().ReverseMap();

            CreateMap<Like, GetLikeDTO>().ReverseMap();

            CreateMap<UserProfile, GetUserProfileDTO>().ReverseMap();
            CreateMap<UserProfile, UpdateUserProfileDTO>().ReverseMap();

            CreateMap<User, GetUserByIdDTO>().ReverseMap();
            CreateMap<User, GetInfoUser>();

            CreateMap<Comment, CreateCommentDTO>().ReverseMap();

            CreateMap<Favourite, FavouritePostDTO>().ReverseMap();

            CreateMap<AddMessageDTO, Message>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => Guid.NewGuid().ToString()))
                .ForMember(dest => dest.CreatedDate, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.UpdatedDate, opt => opt.MapFrom(src => (DateTime?)null))
                .ForMember(dest => dest.Deleted, opt => opt.MapFrom(src => false))
                .ForMember(dest => dest.DeletedDate, opt => opt.MapFrom(src => (DateTime?)null))
                .ReverseMap();

            //CreateMap<User, GetFriendshipWithLastMsgDTO>()
            //    .ForMember(dest => dest.UserProfile, opt => opt.MapFrom(src => src.UserProfile));

            CreateMap<UserProfile, GetUserProfileDTO>();

            CreateMap<Message, GetMessageDTO>();
        }
    }
}
