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

    public async Task<IReadOnlyList<Member>> GetMemberAsync()
    {
        return await dbContext.Members.ToListAsync();
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
}