namespace API.Extensions;
//Using Extension Methods for DRY DTOs
public static class AppUserExtensions
{
    public static UserDto ToDto(this AppUser user, ITokenService tokenService)
    {
        return new UserDto
        {
            Email = user.Email,
            DisplayName = user.DisplayName,
            Id = user.Id,
            Token = tokenService.CreateToken(user)
        };
    }
}