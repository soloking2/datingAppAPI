using API.Helpers;

namespace API.Data;

public class LikesRepository(ApiDbContext dbContext) : ILikesRepository
{
    public async Task<MemberLike?> GetMemberLike(string sourceMemberId, string targetMemberId)
    {
        return await dbContext.Likes.FindAsync(sourceMemberId, targetMemberId);
    }

    public async Task<PaginatedResult<Member>> GetMemberLikes(string predicate, string memberId, PagingParams pagingParams)
    {
        var query = dbContext.Likes.AsQueryable();
        IQueryable<Member> result;
        switch (predicate)
        {
            case "liked":
                result = query.Where(x => x.SourceMemberId == memberId)
                    .Select(x => x.TargetMember);
                break;
            case "likedBy":
                result = query.Where(x => x.TargetMemberId == memberId)
                    .Select(x => x.SourceMember);
                break;
            default:
                var likeIds = await GetCurrentMemberIds(memberId);
                result = query.Where(x => x.TargetMemberId == memberId &&
                                              likeIds.Contains(x.SourceMemberId))
                    .Select(x => x.SourceMember)
                    ;
                break;
        }

        return await PaginationHelper<Member>.CreateAsync(result, pagingParams.PageNumber, pagingParams.PageSize);
    }

    public async Task<IReadOnlyList<string>> GetCurrentMemberIds(string memberId)
    {
        return await dbContext.Likes.Where(x => x.SourceMemberId == memberId)
            .Select(x => x.TargetMemberId).ToListAsync();
    }

    public void DeleteLike(MemberLike like)
    {
        dbContext.Likes.Remove(like);
    }

    public void AddLike(MemberLike like)
    {
        dbContext.Likes.Add(like);
    }

    public async Task<bool> SaveAllChangesAsync()
    {
        return await dbContext.SaveChangesAsync() > 0;
    }
}