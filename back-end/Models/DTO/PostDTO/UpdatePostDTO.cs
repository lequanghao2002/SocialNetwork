using SocialNetwork.Models.Domain;

namespace SocialNetwork.Models.DTO.PostDTO
{
    public class UpdatePostDTO
    {
        public string Id { get; set; }
        public string Content { get; set; }
        public PostStatus Status { get; set; }
        public List<IFormFile>? FileList { get; set; }
        public List<string>? TagList { get; set; }
    }
}
