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

    public async Task<PaginatedResult<Member>> GetMemberAsync(MemberParams memberParams)
    {
        var query = dbContext.Members.AsQueryable();
        query = query.Where(x => x.Id != memberParams.CurrentMemberId);
        if (memberParams.Gender != null)
        {
            query = query.Where(x => x.Gender == memberParams.Gender);
        }

        
        var minDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-memberParams.MaxAge - 1));
        var maxDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-memberParams.MinAge));
        query = query.Where(x => x.DateOfBirth >= minDob && x.DateOfBirth <= maxDob);

        query = memberParams.OrderBy switch
        {
            "created" => query.OrderByDescending(x => x.Created),
            _ => query.OrderByDescending(x => x.LastActive)
        };
        
        return await PaginationHelper<Member>.CreateAsync(query, memberParams.PageNumber, memberParams.PageSize);
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