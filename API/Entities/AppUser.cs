using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;

namespace API.Entities
{
    public class AppUser
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        [MaxLength(100)]
        public required string DisplayName { get; set; }
        [MaxLength(100)]
        public required string Email { get; set; }

        public string? ImageUrl { get; set; }

        public required byte[] PasswordHash { get; set; }
        public required byte[] PasswordSalt { get; set; }
        
        //Navigation property
        [JsonIgnore]
        public Member Member { get; set; } = null!;

    }
}