using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SocialNetwork.Models.DTO.FavouriteDTO;
using SocialNetwork.Models.DTO.LikeDTO;
using SocialNetwork.Models.DTO.PostDTO;
using SocialNetwork.Repositories;
using SocialNetwork.Services;

namespace SocialNetwork.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PostsController : ControllerBase
    {
        private readonly IPostRepository _postRepository;
        private readonly IUserRepository _userRepository;
        private readonly IUserService _userService;

        public PostsController(IPostRepository postRepository, IUserRepository userRepository, IUserService userService) {
            _postRepository = postRepository;
            _userRepository = userRepository;
            _userService = userService;
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
        public async Task<IActionResult> GetAll(string status, int page = 1, int pageSize = 10)
        {
            try
            {
                var userId = _userService.GetUserId();
                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var postList = await _postRepository.GetAll(status, userId, page, pageSize);

                return Ok(postList);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("get-all-by-user-id")]
        public async Task<IActionResult> GetAllByUserId(string userId, int page = 1, int pageSize = 10)
        {
            var currentUserId = _userService.GetUserId();
            if (string.IsNullOrEmpty(currentUserId))
            {
                return Unauthorized();
            }

            try
            {
                var posts = new List<GetPostDTO>();
                if (userId == currentUserId)
                {
                    posts = await _postRepository.GetAllByUserId(userId, page, pageSize, "all");
                    return Ok(posts);
                }
                
                var statusFriend = await _userRepository.GetStatusFriend(currentUserId, userId);
                if (statusFriend == Models.Domain.FriendshipStatus.Friends)
                {
                    posts = await _postRepository.GetAllByUserId(userId, page, pageSize, "friend");
                } 
                else
                {
                    posts = await _postRepository.GetAllByUserId(userId, page, pageSize, "public");
                }
                return Ok(posts);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpGet("get-all-saved-posts")]
        public async Task<IActionResult> GetAllSavedPosts(int page = 1, int pageSize = 10)
        {
            var currentUserId = _userService.GetUserId();
            if (string.IsNullOrEmpty(currentUserId))
            {
                return Unauthorized();
            }

            try
            {
                var postList = await _postRepository.GetAllSaved(currentUserId, page, pageSize);

                return Ok(postList);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("add")]
        public async Task<IActionResult> Add(AddPostDTO postDTO)
        {
            try
            {
                var userId = _userService.GetUserId();

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                postDTO.UserId = userId;
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
        public async Task<IActionResult> Update(UpdatePostDTO postDTO)
        {
            try
            {
                var userId = _userService.GetUserId();

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                postDTO.UserId = userId;

                var result = await _postRepository.Update(postDTO);

                if (result != null)
                {

                    return Ok(result);
                }

                return BadRequest("Update post failed");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> Delete (string id)
        {
            try
            {
                var userId = _userService.GetUserId();

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                var result = await _postRepository.Delete(id, userId);

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
        public async Task<IActionResult> ChangeLike(ChangeLikeDTO likeDTO)
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

        [HttpPost("save")]
        public async Task<IActionResult> SavePost(FavouritePostDTO favouritePostDTO)
        {
            try
            {
                var userId = _userService.GetUserId();

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                favouritePostDTO.UserId = userId;
                var result = await _postRepository.Save(favouritePostDTO);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }

        [HttpPost("unsave")]
        public async Task<IActionResult> UnSavePost(FavouritePostDTO favouritePostDTO)
        {
            try
            {
                var userId = _userService.GetUserId();

                if (string.IsNullOrEmpty(userId))
                {
                    return Unauthorized();
                }

                favouritePostDTO.UserId = userId;
                var result = await _postRepository.UnSave(favouritePostDTO);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest($"Error: {ex.Message}");
            }
        }
    }

   
}
