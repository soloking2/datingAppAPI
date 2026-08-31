
using Microsoft.AspNetCore.Identity;

namespace API.Controllers;

public class AccountController(UserManager<AppUser> userManager, ITokenService tokenService) : BaseController
{
 

 [HttpPost("register")]
 public async Task<ActionResult<UserDto>> Register([FromBody] RegisterDto registrationDto)
 {
  
  var user = new AppUser()
  {
   Email = registrationDto.Email,
   UserName = registrationDto.Email,
   DisplayName = registrationDto.DisplayName,
   ImageUrl = registrationDto.ImageUrl,
   Member = new Member
   {
    Gender = registrationDto.Gender,
    DateOfBirth = registrationDto.DateOfBirth,
    City = registrationDto.City,
    DisplayName = registrationDto.DisplayName,
    Country = registrationDto.Country
   }
  };
  
 
  var result = await userManager.CreateAsync(user, registrationDto.Password);
  if (result.Succeeded)
  {
   await userManager.AddToRoleAsync(user, "Member");
   return Ok(user.ToDto(tokenService));
  }
  else
  {
   foreach (var error in result.Errors)
   {
    ModelState.AddModelError("identity", error.Description);
   }

   return ValidationProblem();
  }
 
  
 }

 [HttpPost("login")]
 public async Task<ActionResult<UserDto>> Login([FromBody] LoginDto loginDto)
 {
  var user = await userManager.FindByEmailAsync(loginDto.Email);
  if (user == null) return Unauthorized("Invalid email or password");

  var result = await userManager.CheckPasswordAsync(user, loginDto.Password);
  if (!result) return Unauthorized("Invalid email or password");
  return await user.ToDto(tokenService);


 }

 [HttpGet("users")]
 public async Task<ActionResult> GetUsers()
 {
  var users = await userManager.Users.Select(user => new
  {
   DisplayName = user.DisplayName,
   Id = user.Id,
   ImageUrl = user.ImageUrl,
   email = user.Email
  }).ToListAsync();
  return Ok(users);
 }
 
 
 
}