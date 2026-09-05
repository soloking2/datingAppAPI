namespace API.Data;

public class UnitOfWork(ApiDbContext context) : IUnitOfWork
{
    private IMemberRepository? _memberRepository;
    private ILikesRepository? _likesRepository;
    private IMessageRepository? _messageRepository;

    public IMemberRepository MemberRepository => _memberRepository ??= new MemberRepository(context);
    public IMessageRepository MessageRepository => _messageRepository ??= new MessageRepository(context);
    public ILikesRepository LikesRepository => _likesRepository ??= new LikesRepository(context);
    
    public async Task<bool> Complete()
    {
        try
        {
            return await context.SaveChangesAsync() > 0;
        }
        catch (DbUpdateException e)
        {
            
            throw new Exception("An error occurred while saving changes", e);
        }
    }

    public bool HasChanges()
    {
        return context.ChangeTracker.HasChanges();
    }
}