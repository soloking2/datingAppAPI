
using API.Extensions;

namespace API.Controllers;

public class AccountController(ApiDbContext dbContext, ITokenService tokenService) : BaseController
{
 private readonly ApiDbContext _dbContext = dbContext;

 [HttpPost("register")]
 public async Task<IActionResult> Register([FromBody] RegisterDto registrationDto)
 {
  if (await EmailExists(registrationDto.Email)) return BadRequest("Email already Exists");
  using var hmac = new HMACSHA512();
  var user = new AppUser()
  {
   Email = registrationDto.Email,
   DisplayName = registrationDto.DisplayName,
   PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes((registrationDto.Password))),
   PasswordSalt = hmac.Key
  };
  await _dbContext.Users.AddAsync(user);
  await _dbContext.SaveChangesAsync();
  return Ok(user.ToDto(tokenService));
 }

 [HttpPost("login")]
 public async Task<ActionResult<UserDto>> Login([FromBody] LoginDto loginDto)
 {
  var user = await _dbContext.Users.SingleOrDefaultAsync(user => user.Email.ToLower() == loginDto.Email.ToLower());
  if (user == null) return Unauthorized("Invalid email or password");
  using var hmac = new HMACSHA512(user.PasswordSalt);
  var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

  for (var i = 0; i < computedHash.Length; i++)
  {
   if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid email or password");
  }

  return user.ToDto(tokenService);


 }

 private async Task<bool> EmailExists(string email)
 {
  return await _dbContext.Users.AnyAsync(user => user.Email.ToLower() == email.ToLower());
 }
}