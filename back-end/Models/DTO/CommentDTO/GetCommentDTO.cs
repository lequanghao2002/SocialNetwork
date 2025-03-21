﻿using SocialNetwork.Models.Domain;
using SocialNetwork.Models.DTO.PostDTO;
using SocialNetwork.Models.DTO.UserDTO;

namespace SocialNetwork.Models.DTO.CommentDTO
{
    public class GetCommentDTO : BaseDate
    {
        public string Id { get; set; }
        public string PostId { get; set; }
        public GetUserDTO User { get; set; }
        public string? ParentId { get; set; }
        public string? Content { get; set; }
        public string? ImageUrl { get; set; }
    }
}
