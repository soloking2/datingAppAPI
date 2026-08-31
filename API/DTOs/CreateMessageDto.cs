

using System.ComponentModel.DataAnnotations;

namespace API.DTOs;

public class CreateMessageDto
{
    [Required(ErrorMessage = "RecipientId field is required")]
    public required string RecipientId { get; set; }
    [Required(ErrorMessage = "Content is required")]
    public required string Content { get; set; }
}