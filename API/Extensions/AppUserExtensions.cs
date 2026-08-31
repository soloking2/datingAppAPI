namespace API.Extensions;
//Using Extension Methods for DRY DTOs
public static class AppUserExtensions
{
    public static async Task<UserDto> ToDto(this AppUser user, ITokenService tokenService)
    {
        return new UserDto
        {
            Email = user.Email!,
            Name = user.DisplayName,
            Id = user.Id,
            ImageUrl = user.ImageUrl,
            Token = await tokenService.CreateToken(user)
        };
    }
}