namespace API.Entities;

public class SeedDto
{
    public required string Id { get; set; } = null!;
    public required string Email { get; set; }
    public required DateOnly DateOfBirth{ get; set; }
    public required string ImageUrl { get; set; }
    public required string DisplayName { get; set; }
    public required DateTime Created { get; set; }
    public required DateTime LastActive { get; set; }
    public required string Gender { get; set; }
    public required string Description { get; set; }
    public required string City { get; set; }
    public required string Country { get; set; }
}