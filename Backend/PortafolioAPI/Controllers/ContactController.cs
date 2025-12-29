using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortafolioAPI.Data;
using PortafolioAPI.DTOs;
using PortafolioAPI.Models;
using PortafolioAPI.Services;
using System.ComponentModel.DataAnnotations;

namespace PortafolioAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IEmailService _emailService;
    private readonly ILogger<ContactController> _logger;

    public ContactController(
        ApplicationDbContext context,
        IEmailService emailService,
        ILogger<ContactController> logger)
    {
        _context = context;
        _emailService = emailService;
        _logger = logger;
    }

    [HttpPost]
    public async Task<ActionResult<ContactResponse>> SendContact([FromBody] ContactRequest request)
    {
        // Validaciones
        if (string.IsNullOrWhiteSpace(request.Name))
            return BadRequest(new ContactResponse 
            { 
                Success = false, 
                Message = "El nombre es requerido" 
            });

        if (string.IsNullOrWhiteSpace(request.Email) || !new EmailAddressAttribute().IsValid(request.Email))
            return BadRequest(new ContactResponse 
            { 
                Success = false, 
                Message = "Email inválido" 
            });

        if (string.IsNullOrWhiteSpace(request.Message))
            return BadRequest(new ContactResponse 
            { 
                Success = false, 
                Message = "El mensaje es requerido" 
            });

        try
        {
            // Guardar en base de datos
            var contactMessage = new ContactMessage
            {
                Name = request.Name.Trim(),
                Email = request.Email.Trim().ToLower(),
                Subject = string.IsNullOrWhiteSpace(request.Subject) 
                    ? "Sin asunto" 
                    : request.Subject.Trim(),
                Message = request.Message.Trim(),
                CreatedAt = DateTime.UtcNow
            };

            _context.ContactMessages.Add(contactMessage);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Contact message saved: ID {contactMessage.Id} from {contactMessage.Email}");

            // Enviar email
            var emailSent = await _emailService.SendContactEmailAsync(
                contactMessage.Name,
                contactMessage.Email,
                contactMessage.Subject,
                contactMessage.Message
            );

            if (!emailSent)
            {
                _logger.LogWarning($"Email notification failed for contact ID {contactMessage.Id}");
            }

            return Ok(new ContactResponse
            {
                Success = true,
                Message = "¡Gracias por tu mensaje! Te contactaré pronto."
            });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error processing contact: {ex.Message}");
            return StatusCode(500, new ContactResponse
            {
                Success = false,
                Message = "Error al procesar tu mensaje. Por favor intenta nuevamente."
            });
        }
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ContactMessage>>> GetMessages()
    {
        try
        {
            var messages = await _context.ContactMessages
                .OrderByDescending(m => m.CreatedAt)
                .Take(50)
                .ToListAsync();

            return Ok(messages);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error retrieving messages: {ex.Message}");
            return StatusCode(500, new { message = "Error al obtener mensajes" });
        }
    }

    [HttpGet("health")]
    public IActionResult Health()
    {
        return Ok(new { status = "ok", timestamp = DateTime.UtcNow });
    }
}
