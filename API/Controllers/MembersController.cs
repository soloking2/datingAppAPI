

using System.Security.Claims;
using API.Extensions;

namespace API.Controllers
{
    [Authorize]
    public class MembersController(IMemberRepository memberRepository, IPhotoService photoService) : BaseController
    {
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<Member>>> Get()
        {
            var members = await memberRepository.GetMemberAsync();
            return Ok(members);
        }
       
        [HttpGet("{id}")]
        public async Task<ActionResult<Member>> GetMember(string id)
        {
            var member = await memberRepository.GetMemberByIdAsync(id);
            if (member == null) return NotFound($"User with id {id} not found");
            return Ok(member);
        }

        
        [HttpGet("{id}/photos")]
        public async Task<ActionResult<IReadOnlyList<Photo>>> GetPhotos(string id)
        {
           return Ok(await memberRepository.GetPhotosForMemberAsync(id));
        }

        [HttpPut]
        public async Task<ActionResult> UpdateMember(MemberUpdateDto memberUpdateDto)
        {
            var memberId = User.GetMemberId();
            var member = await memberRepository.GetMemberForUpdate(memberId);
            if (member is null) throw new BadHttpRequestException("Could not not get member");
            member.DisplayName = memberUpdateDto.DisplayName ?? member.DisplayName;
            member.Description = memberUpdateDto.Description ?? member.Description;
            member.City = memberUpdateDto.City ?? member.City;
            member.Country = memberUpdateDto.Country ?? member.Country;
            
            member.User.DisplayName = memberUpdateDto.DisplayName ?? member.User.DisplayName;

            memberRepository.Update(member); //This is optional and may not be required

            if (await memberRepository.SaveAllAsync())
            {
                return NoContent();
            }
            else
            {
                return BadRequest("Update failed");
            }

        }
        
        [HttpPost("add-photo")]
        public async Task<ActionResult<Photo>> AddPhoto([FromForm] IFormFile file)
        {
        var member = await memberRepository.GetMemberForUpdate(User.GetMemberId());
        if (member == null) BadRequest("Cannot upload member");
        var result = await photoService.UploadPhotoAsync(file);
        if(result.Error != null) return BadRequest(result.Error.Message);
        var photo = new Photo
        {
            Url = result.SecureUrl.AbsoluteUri,
            PublicId = result.PublicId,
            MemberId = User.GetMemberId()
        };
        if (member?.ImageUrl == null)
        {
            member?.ImageUrl = photo.Url;
            member?.User.ImageUrl = photo.Url;
        }
        member?.Photos.Add(photo);
        if (await memberRepository.SaveAllAsync())
        {
            return photo;
        }
        return BadRequest("Unable to upload photo");
        }

        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var member = await memberRepository.GetMemberForUpdate(User.GetMemberId());
            if (member == null) return BadRequest("Cannot get member from token");
            var photo = member.Photos.SingleOrDefault(x => x.Id == photoId);
            if (member.ImageUrl == photo?.Url || photo == null) return BadRequest("Cannot set main photo");
            member.ImageUrl = photo.Url;
            member.User.ImageUrl = photo.Url;
            
            if (await memberRepository.SaveAllAsync())
            {
                return NoContent();
            }
            return BadRequest("Problem setting main photo");
        }

        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var member = await memberRepository.GetMemberForUpdate(User.GetMemberId());
            if (member == null) return BadRequest("Cannot get member from token");
            var photo = member.Photos.SingleOrDefault(x => x.Id == photoId);
            if (member.ImageUrl == photo?.Url || photo == null) return BadRequest("Cannot remove main photo");

            if (photo.PublicId != null)
            {
                var result = await photoService.DeletePhotoAsync(photo.PublicId);
                if(result.Error != null) return BadRequest(result.Error.Message);
            }

            member.Photos.Remove(photo);
             
            if (await memberRepository.SaveAllAsync())
            {
                return Ok();
            }
            return BadRequest("Problem Deleting photo");

        }
    }
    
   
    
}
