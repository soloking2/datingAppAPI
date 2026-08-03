using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MembersController(ApiDbContext dbContext) : ControllerBase
    {
        private readonly ApiDbContext _dbContext = dbContext;

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var members = await (from user in _dbContext.Users
                    select new
                    {
                        Id = user.Id,
                        Name = user.DisplayName,
                        Email = user.Email
                    }
                ).ToListAsync();
            return Ok(members);
        }
        
        [HttpGet("{id}")]
        public async Task<IActionResult> GetMember(string id)
        {
            var member = await _dbContext.Users.Where(user => user.Id == id).ToListAsync<AppUser>();
            if (member.Count == 0) return NotFound($"User with id {id} not found");
            return Ok(member);
        }
    }
    
}
