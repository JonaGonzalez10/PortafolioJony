using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using MimeKit.Text;

namespace PortafolioAPI.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<bool> SendContactEmailAsync(string name, string email, string subject, string message)
    {
        try
        {
            var emailMessage = new MimeMessage();
            
            // Remitente (tu email configurado)
            emailMessage.From.Add(new MailboxAddress(
                _configuration["Email:FromName"] ?? "Portafolio Jonathan",
                _configuration["Email:FromAddress"] ?? "noreply@portafolio.com"
            ));

            // Destinatario (tu email donde recibirás los mensajes)
            emailMessage.To.Add(new MailboxAddress(
                "Jonathan González",
                _configuration["Email:ToAddress"] ?? "jonathan.gonzalez1095@outlook.com"
            ));

            // Asunto
            emailMessage.Subject = $"[Contacto Portafolio] {subject}";

            // Cuerpo del email en HTML
            var bodyBuilder = new BodyBuilder
            {
                HtmlBody = $@"
                    <html>
                    <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
                        <div style='max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;'>
                            <div style='background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);'>
                                <h2 style='color: #14b8a6; margin-top: 0;'>Nuevo mensaje de contacto</h2>
                                
                                <div style='margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #14b8a6;'>
                                    <p style='margin: 5px 0;'><strong>Nombre:</strong> {name}</p>
                                    <p style='margin: 5px 0;'><strong>Email:</strong> {email}</p>
                                    <p style='margin: 5px 0;'><strong>Asunto:</strong> {subject}</p>
                                </div>

                                <div style='margin: 20px 0;'>
                                    <h3 style='color: #333; font-size: 16px;'>Mensaje:</h3>
                                    <p style='white-space: pre-wrap; background-color: #f8f9fa; padding: 15px; border-radius: 4px;'>{message}</p>
                                </div>

                                <hr style='border: none; border-top: 1px solid #ddd; margin: 20px 0;'>
                                
                                <p style='font-size: 12px; color: #666; margin: 0;'>
                                    Enviado desde tu portafolio web el {DateTime.Now:dd/MM/yyyy HH:mm}
                                </p>
                            </div>
                        </div>
                    </body>
                    </html>"
            };

            emailMessage.Body = bodyBuilder.ToMessageBody();

            // Configuración SMTP
            using var smtp = new SmtpClient();
            
            var smtpHost = _configuration["Email:SmtpHost"] ?? "smtp.gmail.com";
            var smtpPort = int.Parse(_configuration["Email:SmtpPort"] ?? "587");
            var smtpUser = _configuration["Email:SmtpUser"];
            var smtpPass = _configuration["Email:SmtpPassword"];

            if (string.IsNullOrEmpty(smtpUser) || string.IsNullOrEmpty(smtpPass))
            {
                _logger.LogError("SMTP credentials not configured");
                return false;
            }

            await smtp.ConnectAsync(smtpHost, smtpPort, SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(smtpUser, smtpPass);
            await smtp.SendAsync(emailMessage);
            await smtp.DisconnectAsync(true);

            _logger.LogInformation($"Email sent successfully from {email}");
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error sending email: {ex.Message}");
            return false;
        }
    }
}
