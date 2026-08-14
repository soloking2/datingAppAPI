

namespace API.Controllers
{
    [Authorize]
    public class MembersController(IMemberRepository memberRepository) : BaseController
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
    }
    
}
