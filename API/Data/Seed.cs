using System.Text.Json;
using Microsoft.AspNetCore.Identity;

namespace API.Data;

public static class Seed
{
    public static async Task SeedUsers(UserManager<AppUser> userManager)
    {
        if (await userManager.Users.AnyAsync())
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
            
            var user = new AppUser
            {
                Id = member.Id,
                DisplayName = member.DisplayName,
                UserName = member.Email,
                Email = member.Email,
                ImageUrl = member.ImageUrl,
                Member = new Member
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
                }
            };
            user.Member.Photos.Add(new Photo
            {
                Url = member.ImageUrl,
                MemberId = member.Id
            });
            var result = await userManager.CreateAsync(user, "Pa$$word123");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(user, "Member");
            }
            else
            {
                Console.WriteLine(result.Errors.First().Description);
            }
        }

        var admin = new AppUser()
        {
            UserName = "admin@test.com",
            Email = "admin@test.com",
            DisplayName = "Admin"
        };
        var res = await userManager.CreateAsync(admin, "Pa$$word123");
        if (res.Succeeded)
        {
            await userManager.AddToRolesAsync(admin, ["Admin", "Moderator"]);
        } else
        {
            Console.WriteLine(res.Errors.First().Description);
        }
    }
}