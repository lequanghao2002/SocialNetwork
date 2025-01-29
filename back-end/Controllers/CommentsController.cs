using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SocialNetwork.Models.Domain;
using SocialNetwork.Models.DTO.CommentDTO;
using SocialNetwork.Repositories;

namespace SocialNetwork.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentsController : ControllerBase
    {
        private readonly ICommentRepository _commentRepository;
        public CommentsController(ICommentRepository commentRepository) {
            _commentRepository = commentRepository;
        }

        [HttpGet("get-list-comment")]
        public async Task<IActionResult> GetListComment(string postId) {
            try
            {
                var result = await _commentRepository.GetListComment(postId);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("create-comment")]
        public async Task<IActionResult> CreateComment(CreateCommentDTO comment)
        {
            try
            {
                var result = await _commentRepository.CreateComment(comment);
                if (result != null)
                {
                    return Ok(result);

                }
                else
                {
                    return BadRequest();
                }

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("update-comment")]
        public async Task<IActionResult> UpdateComment(UpdateCommentDTO comment)
        {
            try
            {
                var result = await _commentRepository.UpdateComment(comment);
                if (result != null)
                {
                    return Ok(result);

                }
                else
                {
                    return BadRequest();
                }

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("delete-comment")]
        public async Task<IActionResult> DeleteComment(string id)
        {
            try
            {
                var result = await _commentRepository.DeleteComment(id);
                if (result != null)
                {
                    return Ok(result);

                }
                else
                {
                    return BadRequest();
                }

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
