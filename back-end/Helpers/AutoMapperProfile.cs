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
using Newtonsoft.Json;
using SocialNetwork.Models.DTO.FavouriteDTO;

namespace SocialNetwork.Helpers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<AddPostDTO, Post>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => Guid.NewGuid().ToString()))
                .ForMember(dest => dest.Images, opt => opt.MapFrom(src => (src.Images != null && src.Images.Count > 0) ? JsonConvert.SerializeObject(src.Images) : null))
                .ForMember(dest => dest.CreatedDate, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.UpdatedDate, opt => opt.MapFrom(src => (DateTime?)null)) 
                .ForMember(dest => dest.Deleted, opt => opt.MapFrom(src => false))
                .ForMember(dest => dest.DeletedDate, opt => opt.MapFrom(src => (DateTime?)null));
            CreateMap<Post, GetPostDTO>().ReverseMap();
            CreateMap<UpdatePostDTO, Post>()
               .ForMember(dest => dest.Images, opt => opt.MapFrom(src => (src.Images != null && src.Images.Count > 0) ?  JsonConvert.SerializeObject(src.Images) : null))
               .ForMember(dest => dest.UpdatedDate, opt => opt.MapFrom(_ => DateTime.UtcNow)); 

            CreateMap<Tag, GetTagDTO>().ReverseMap();
            CreateMap<Tag, AddTagDTO>().ReverseMap();

            CreateMap<Like, GetLikeDTO>().ReverseMap();
            CreateMap<Like, ChangeLikeDTO>().ReverseMap();

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
