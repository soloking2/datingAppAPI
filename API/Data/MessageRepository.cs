using API.Helpers;

namespace API.Data;

public class MessageRepository(ApiDbContext dbContext) : IMessageRepository
{
    public void AddMessage(Message message)
    {
        dbContext.Messages.Add(message);
    }

    public void DeleteMessage(Message message)
    {
        dbContext.Messages.Remove(message);
    }

    public async Task<Message?> GetMessage(string messageId)
    {
        return await dbContext.Messages.FindAsync(messageId);
    }

    public async Task<PaginatedResult<MessageDto>> GetMessagesForMember(MessageParams messageParams)
    {
        var query = dbContext.Messages.OrderByDescending(x => x.MessageSent).AsQueryable();
        query = messageParams.Container switch
        {
            "Outbox" => query.Where(x => x.SenderId == messageParams.MemberId && x.SenderDeleted == false),
            _ => query.Where(x => x.RecipientId == messageParams.MemberId && x.RecipientDeleted == false)
        };
        var messageQuery = query.Select(MessageExtensions.ToDtoProjection());
        return await PaginationHelper<MessageDto>.CreateAsync(messageQuery, 
            messageParams.PageNumber, messageParams.PageSize);
    }

    public async Task<IReadOnlyList<MessageDto>> GetMessageThread(string currentMemberId, string recipientId)
    {
        await dbContext.Messages.Where(x => x.RecipientId == currentMemberId
                                            && x.SenderId == recipientId && x.DateRead == null)
            .ExecuteUpdateAsync(setters => setters.SetProperty(x => x.DateRead, DateTime.UtcNow));
        return await dbContext.Messages.Where(x => 
                (x.RecipientId == currentMemberId
                 && x.RecipientDeleted == false
                 && x.SenderId == recipientId)
                || (x.SenderId == currentMemberId
                    && x.SenderDeleted == false
                    && x.RecipientId == recipientId))
            .OrderBy(x => x.MessageSent)
            .Select(MessageExtensions.ToDtoProjection())
            .ToListAsync();
    }

    public async Task<bool> SaveAllAsync()
    {
        return await dbContext.SaveChangesAsync() > 0;
    }
}