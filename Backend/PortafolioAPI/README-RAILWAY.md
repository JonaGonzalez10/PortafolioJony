# Configuración para Railway - Backend Portafolio .NET Core

## Variables de Entorno Requeridas

### Base de Datos (Azure SQL)
```
DATABASE_URL=Server=tu-servidor.database.windows.net,1433;Initial Catalog=PortafolioDB;User ID=tu-usuario;Password=tu-password;Encrypt=True;TrustServerCertificate=False;
```

### Email (Gmail SMTP)
```
Email__SmtpHost=smtp.gmail.com
Email__SmtpPort=587
Email__SmtpUser=tu-email@gmail.com
Email__SmtpPassword=tu-app-password
Email__ToAddress=jonathan.gonzalez1095@outlook.com
Email__FromName=Portafolio Jonathan
Email__FromAddress=noreply@portafolio.com
```

### Frontend (URL de tu app Angular)
```
FRONTEND_URL=https://tu-portafolio.vercel.app
```

### ASP.NET Core
```
ASPNETCORE_ENVIRONMENT=Production
PORT=8080
```

## Cómo configurar Gmail para SMTP

1. Ir a tu cuenta de Google → Seguridad
2. Activar "Verificación en 2 pasos"
3. Ir a "Contraseñas de aplicaciones"
4. Crear una nueva contraseña para "Correo"
5. Copiar la contraseña de 16 caracteres
6. Usar esa contraseña en `Email__SmtpPassword`

## Endpoints Disponibles

- `GET /health` - Health check
- `POST /api/contact` - Enviar mensaje de contacto
- `GET /api/contact` - Obtener todos los mensajes (admin)

## Ejemplo de Request

```json
POST /api/contact
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "subject": "Consulta sobre proyecto",
  "message": "Hola, me interesa trabajar contigo..."
}
```

## Response

```json
{
  "success": true,
  "message": "¡Gracias por tu mensaje! Te contactaré pronto."
}
```
