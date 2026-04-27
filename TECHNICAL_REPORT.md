# Sentendar Online Banking - Reporte Técnico de Arquitectura

Este documento detalla la implementación técnica, arquitectura y medidas de seguridad del sistema bancario **Sentendar**, diseñado para cumplir con los más altos estándares de escalabilidad y seguridad requeridos para la Evaluación Sumativa 2.

## 1. Arquitectura del Sistema

El sistema implementa una arquitectura **Decoupled Full-Stack** con los siguientes componentes:

### Backend (MVC Pattern)
- **Tecnología**: Node.js con Framework Express.
- **Patrón MVC**: Se ha implementado un patrón de Diseño **Modelo-Vista-Controlador** estricto:
  - **Models**: Definen la interacción con la base de datos (PostgreSQL/Supabase) mediante una capa de abstracción.
  - **Controllers**: Gestionan la lógica de negocio y procesamiento de peticiones.
  - **Routes**: Definen la interfaz de la API y exponen los endpoints.
- **Documentación**: Implementación de **Swagger / OpenAPI** para la especificación técnica de todos los endpoints (GET, POST, PUT, DELETE).

### Frontend (React.js)
- **Tecnología**: React 18 con TailwindCSS para un diseño premium y responsivo.
- **Estado**: Gestión de estado mediante Hooks (`useState`, `useEffect`) y persistencia mediante `localStorage`.
- **Integración**: Consumo de API REST centralizada mediante Axios.

### Aplicación Móvil (React Native / Expo)
- **Tecnología**: React Native con Expo Router.
- **Sincronización**: Conexión directa a la misma API centralizada que el sitio web, asegurando paridad de datos en tiempo real.

## 2. Seguridad y Autenticación

### Gestión de Sesiones (JWT)
- Se utiliza **JSON Web Tokens (JWT)** para el manejo de sesiones seguras.
- El servidor firma los tokens utilizando una clave secreta (`JWT_SECRET`).
- Cada petición protegida requiere el token en el encabezado `Authorization: Bearer <token>`.
- Los datos sensibles (contraseñas) son cifrados mediante **BCRYPT** antes de ser almacenados en la base de datos.

### Protección de Datos
- Implementación de **Middlewares** de autenticación y autorización (Admin vs User).
- Sanitización de entradas para prevenir ataques como Inyección SQL y XSS.

## 3. Infraestructura y Despliegue (Cloud)

### Despliegue (Vercel)
- El backend y frontend están desplegados en la plataforma **Vercel**, configurada para despliegue continuo (CI/CD) desde el repositorio oficial de GitHub.
- El backend aprovecha la infraestructura de **Vercel Functions** para una ejecución Serverless eficiente.

### Gestión de Certificados SSL/HTTPS
- **Proveedores**: Vercel provee automáticamente certificados SSL de **Let's Encrypt**.
- **Gestión Automática**: Los certificados se renuevan automáticamente cada 90 días sin intervención manual.
- **Protocolo**: Se fuerza el uso de **TLS 1.3** y redirección automática de HTTP a HTTPS, asegurando que todas las transferencias de fondos y abonos viajen cifradas de extremo a extremo.

## 4. Base de Datos (Supabase)
- **Motor**: PostgreSQL.
- **Conectividad**: Conexión segura mediante `DATABASE_URL` con soporte para Pooling de conexiones.
- **Esquema**: Normalizado para mantener la integridad referencial entre Usuarios, Cuentas y Transacciones.

---

**Desarrollado por**: Pablo Rubilar
**Módulo**: Taller de Plataformas Web
**Fecha**: 27 de Abril, 2026
