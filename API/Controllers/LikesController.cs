

using API.Helpers;
using Microsoft.AspNetCore.Http.HttpResults;

namespace API.Controllers;

public class LikesController(IUnitOfWork unitOfWork) : BaseController
{
   [HttpPost("{targetMemberId}")]
   public async Task<ActionResult> ToggleLike(string targetMemberId)
   {
      var sourceMemberId = User.GetMemberId();
      if (sourceMemberId == targetMemberId) return BadRequest("You cannot like yourself");
      var existingLike = await unitOfWork.LikesRepository.GetMemberLike(sourceMemberId, targetMemberId);
      if (existingLike == null)
      {
         var like = new MemberLike
         {
            SourceMemberId = sourceMemberId,
            TargetMemberId = targetMemberId
         };
         unitOfWork.LikesRepository.AddLike(like);
      }
      else
      {
         unitOfWork.LikesRepository.DeleteLike(existingLike);
      }

      if (await unitOfWork.Complete())
      {
         return Ok();
      }
      return BadRequest("Failed to toggle like");
      
   }

   [HttpGet("list")]
   public async Task<ActionResult<IReadOnlyList<string>>> GetCurrentMemberIds()
   {
      return Ok(await unitOfWork.LikesRepository.GetCurrentMemberIds(User.GetMemberId()));
   }

   [HttpGet]
   public async Task<ActionResult<IReadOnlyList<MemberLike>>> GetMemberLikes([FromQuery] LikesParams likesParams)
   {
      likesParams.MemberId = User.GetMemberId();
      var members = await unitOfWork.LikesRepository.GetMemberLikes(likesParams);
      return Ok(members);
   }
}