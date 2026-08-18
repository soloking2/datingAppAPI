using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class RegisterDto
{
    [Required]
    [MinLength(3)]
    public string DisplayName { get; set; } = "";
    [Required]
    [EmailAddress]
    public string Email { get; set; } = "";
    [Required]
    [MinLength(6, ErrorMessage = "Password must have at least 6 characters")]
    public string Password { get; set; } = "";

    public string? ImageUrl { get; set; }

}
    