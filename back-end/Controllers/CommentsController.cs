using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SocialNetwork.Models.Domain;
using SocialNetwork.Models.DTO.CommentDTO;
using SocialNetwork.Repositories;

namespace SocialNetwork.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CommentsController : ControllerBase
    {
        private readonly ICommentRepository _commentRepository;
        public CommentsController(ICommentRepository commentRepository) {
            _commentRepository = commentRepository;
        }

        [HttpGet("get-by-postId")]
        public async Task<IActionResult> GetByPostId(string postId) {
            try
            {
                var result = await _commentRepository.GetByPostId(postId);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
