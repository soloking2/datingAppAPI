

using API.Helpers;
using Microsoft.AspNetCore.Http.HttpResults;

namespace API.Controllers;

public class LikesController(ILikesRepository likesRepository) : BaseController
{
   [HttpPost("{targetMemberId}")]
   public async Task<ActionResult> ToggleLike(string targetMemberId)
   {
      var sourceMemberId = User.GetMemberId();
      if (sourceMemberId == targetMemberId) return BadRequest("You cannot like yourself");
      var existingLike = await likesRepository.GetMemberLike(sourceMemberId, targetMemberId);
      if (existingLike == null)
      {
         var like = new MemberLike
         {
            SourceMemberId = sourceMemberId,
            TargetMemberId = targetMemberId
         };
         likesRepository.AddLike(like);
      }
      else
      {
         likesRepository.DeleteLike(existingLike);
      }

      if (await likesRepository.SaveAllChangesAsync())
      {
         return Ok();
      }
      return BadRequest("Failed to toggle like");
      
   }

   [HttpGet("list")]
   public async Task<ActionResult<IReadOnlyList<string>>> GetCurrentMemberIds()
   {
      return Ok(await likesRepository.GetCurrentMemberIds(User.GetMemberId()));
   }

   [HttpGet]
   public async Task<ActionResult<IReadOnlyList<MemberLike>>> GetMemberLikes(string predicate,[FromQuery] PagingParams pagingParams)
   {
      var members = await likesRepository.GetMemberLikes(predicate,  User.GetMemberId(), pagingParams);
      return Ok(members);
   }
}