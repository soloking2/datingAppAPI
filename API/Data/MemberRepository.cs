using API.Helpers;

namespace API.Data;

public class MemberRepository(ApiDbContext dbContext) : IMemberRepository
{
    public void Update(Member member)
    {
        dbContext.Entry(member).State = EntityState.Modified;
    }

    public async Task<bool> SaveAllAsync()
    {
        return await dbContext.SaveChangesAsync() > 0;
    }

    public async Task<PaginatedResult<Member>> GetMemberAsync(PagingParams pagingParams)
    {
        var query = dbContext.Members.AsQueryable();
        return await PaginationHelper<Member>.CreateAsync(query, pagingParams.PageNumber, pagingParams.PageSize);
    }

    public async Task<Member?> GetMemberByIdAsync(string id)
    {
        return (await dbContext.Members.FindAsync(id));
    }

    public async Task<IReadOnlyList<Photo>> GetPhotosForMemberAsync(string memberId)
    {
        return await dbContext.Members.Where(m => m.Id == memberId)
            .SelectMany(m => m.Photos).ToListAsync();
    }

    public async Task<Member?> GetMemberForUpdate(string id)
    {
        return await dbContext.Members.Include(member => member.User)
            .Include(member => member.Photos)
            .SingleOrDefaultAsync(x => x.Id == id);
    }
}