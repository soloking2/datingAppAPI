using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class ApiDbContext(DbContextOptions<ApiDbContext> dbContextOptions) : DbContext(dbContextOptions)
{
    public DbSet<AppUser> Users { get; set; }
}