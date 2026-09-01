using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class AdminController(UserManager<AppUser> userManager) : BaseController
{
    [Authorize(Policy = "RequireAdminRole")]
    [HttpGet("users-with-roles")]
    public async Task<ActionResult> GetUsersWithRoles()
    {
        var users = await userManager.Users.OrderBy(x => x.Email).ToListAsync();
        var userListWithRoles = new List<object>();

        foreach (var user in users)
        {
            var role = await userManager.GetRolesAsync(user);
            userListWithRoles.Add(new
            {
                user.Id,
                user.Email,
                role
            });
        }
        return Ok(userListWithRoles);
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpPost("edit-roles/{userId}")]
    public async Task<ActionResult<IList<string>>> EditRoles(string userId, [FromQuery] string roles)
    {
        if(string.IsNullOrEmpty(roles)) return  BadRequest("Roles must not be empty");
        var selectedRoles = roles.Split(",");
        var user = await userManager.FindByIdAsync(userId);
        if (user == null) return BadRequest("Cannot retrieve the user");
        var userRoles = await userManager.GetRolesAsync(user);
        var result = await userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));
        if (!result.Succeeded) return BadRequest("Failed to add to roles");
        result = await userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));
        if(!result.Succeeded) return BadRequest("Failed to remove from roles");

        return Ok(await userManager.GetRolesAsync(user));

    }

    [Authorize(Policy = "ModeratePhotoRole")]
    [HttpGet("photos-to-moderate")]
    public ActionResult GetPhotosForModeration()
    {
        return Ok("Admins or moderators can see this");
    }
    
    
    
}