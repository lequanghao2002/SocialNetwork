using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SocialNetwork.Models.DTO.LikeDTO;
using SocialNetwork.Models.DTO.PostDTO;
using SocialNetwork.Repositories;

namespace SocialNetwork.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly IPostRepository _postRepository;

        public PostsController(IPostRepository postRepository) {
            _postRepository = postRepository;
        }

        [HttpGet("search-post")]
        public async Task<IActionResult> Search(string keyword)
        {
            try
            {
                var postList = await _postRepository.Search(keyword);

                return Ok(postList);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("get-all")]
        public async Task<IActionResult> GetAll(string filter, string? userId = null, int page = 1, int pageSize = 10)
        {
            try
            {
                var postList = await _postRepository.GetAll(filter, userId, page, pageSize);

                return Ok(postList);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("get-all-by-user")]
        public async Task<IActionResult> GetAllByUserId(string userId, int page = 1, int pageSize = 10)
        {
            try
            {
                var postList = await _postRepository.GetAllByUserId(userId, page, pageSize);

                return Ok(postList);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet("get-all-post-save-by-user")]
        public async Task<IActionResult> GetAllPostSave(string userId, int page = 1, int pageSize = 10)
        {
            try
            {
                var postList = await _postRepository.GetAllPostSaveByUserId(userId, page, pageSize);

                return Ok(postList);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet("get-by-id")]
        public async Task<IActionResult> GetById(string id)
        {
            try
            {
                var postById = await _postRepository.GetById(id);

                return Ok(postById);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("add")]
        public async Task<IActionResult> Add([FromForm]AddPostDTO postDTO)
        {
            try
            {
                var result = await _postRepository.Add(postDTO);

                if (result != null) {

                    return Ok(result);
                }

                return BadRequest("Create post failed");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpPut("update")]
        public async Task<IActionResult> Update([FromForm] UpdatePostDTO postDTO)
        {
            try
            {
                var result = await _postRepository.Update(postDTO);

                if (result != null)
                {

                    return Ok(result);
                }

                return BadRequest("Create post failed");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> Delete (string Id)
        {
            try
            {
                var result = await _postRepository.Delete(Id);

                if (result)
                {
                    return Ok(result);
                }

                return BadRequest("Create post failed");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpPost("change-like")]
        public async Task<IActionResult> ChangeLike(GetLikeDTO likeDTO)
        {
            try
            {
                var result = await _postRepository.ChangeLike(likeDTO);

                return Ok(result);

            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpGet("count-shared")]
        public async Task<IActionResult> CountShared(string id)
        {
            try
            {
                var result = await _postRepository.CountShared(id);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }


        [HttpPost("save-post")]
        public async Task<IActionResult> SavePost(FavouritePostDTO favouritePostDTO)
        {
            try
            {
                var result = await _postRepository.Save(favouritePostDTO);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }
    }

   
}
