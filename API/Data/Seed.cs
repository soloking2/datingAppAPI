using System.Text.Json;

namespace API.Data;

public class Seed
{
    public static async Task SeedUsers(ApiDbContext context)
    {
        if (await context.Users.AnyAsync())
        {
            return;
        }
        
        var memberData = await File.ReadAllTextAsync("Data/UserSeedData.json");
        var members = JsonSerializer.Deserialize<List<SeedDto>>(memberData);

        if (members == null)
        {
            Console.WriteLine("No data found in seed data");
            return;
        }

        foreach (var member in members)
        {
            var hmac = new HMACSHA512();
            var user = new AppUser
            {
                Id = member.Id,
                DisplayName = member.DisplayName,
                Email = member.Email,
                ImageUrl = member.ImageUrl,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes("password")),
                PasswordSalt = hmac.Key
            };
            user.Member = new Member
            {
                Id = member.Id,
                DisplayName = member.DisplayName,
                City = member.City,
                Country = member.Country,
                DateOfBirth = member.DateOfBirth,
                Created = member.Created,
                Description = member.Description,
                Gender = member.Gender,
                LastActive = member.LastActive,
                ImageUrl = member.ImageUrl
            };
            user.Member.Photos.Add(new Photo
            {
                Url = member.ImageUrl,
                MemberId = member.Id
            });
            context.Users.Add(user);
        }
        await context.SaveChangesAsync();
    }
}