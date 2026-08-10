

namespace API.Controllers
{
    public record User(string Id, string Name, string Email);
    public class MembersController(ApiDbContext dbContext) : BaseController
    {
        private readonly ApiDbContext _dbContext = dbContext;

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var members = await (from user in _dbContext.Users
                    select new User(user.Id, user.DisplayName, user.Email)
                ).ToListAsync();
            return Ok(members);
        }
        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetMember(string id)
        {
            var member = await _dbContext.Users.Where(user => user.Id == id)
                .ToListAsync();
            if (member.Count == 0) return NotFound($"User with id {id} not found");
            var user = new User(member.First().Id, member.First().DisplayName, member.First().Email);
            return Ok(user);
        }
    }
    
}
