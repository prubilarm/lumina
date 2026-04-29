# Lumina Bank - Online Banking System (Banca en Línea)

Lumina Bank es una plataforma bancaria de grado fin-tech completa, diseñada para ser segura, escalable y con una experiencia de usuario premium.

## 🚀 Características Principales

*   **Multicuenta**: Cada usuario inicia con una Cuenta de Ahorros y una Cuenta Corriente.
*   **Transferencias Pro**: Soporte para transferencias entre cuentas propias y a terceros con validación en tiempo real.
*   **Dashboard Premium**: Interfaz moderna con Glassmorphism, gráficas de gastos y balance total unificado.
*   **Sistema de Notificaciones**: Confirmación de cuenta automática vía Email (Nodemailer).
*   **Panel Administrativo**: Los administradores pueden visualizar métricas globales y transacciones de todo el sistema.
*   **Documentación API**: Swagger UI integrado para facilitar la integración de desarrolladores.
*   **Core Híbrido**: Motor de base de datos inteligente que funciona con PostgreSQL (Supabase) o en Memoria (Mock) para pruebas instantáneas.

---

## 🛠️ Stack Tecnológico

*   **Backend**: Node.js + Express
*   **Web**: React (Vite) + Tailwind CSS + Lucide
*   **Mobile**: React Native (Expo) + Lucide Native
*   **DB**: PostgreSQL / Supabase
*   **Email**: Nodemailer (Ethereal / SMTP)
*   **Docs**: Swagger (OpenAPI 3.0)

---

## ⚙️ Instalación y Ejecución

### 1. Requisitos
- [Node.js](https://nodejs.org/) (v18+)
- [Docker](https://www.docker.com/) (Opcional, para DB real)

### 2. Backend
```bash
cd backend
npm install
npm run dev
```
*   La API correrá en `http://localhost:5000`
*   Documentación Swagger: `http://localhost:5000/api-docs`

### 3. Frontend (Web)
```bash
cd frontend
npm install
npm run dev
```
*   Accede a `http://localhost:3000` (o el puerto que asigne Vite)

### 4. Mobile (React Native)
```bash
cd mobile
npm install
npx expo start
```

---

## 🔐 Seguridad y Roles

El sistema utiliza **JWT (JSON Web Tokens)** para la seguridad de las rutas.
*   **Admin**: Asignado automáticamente al primer usuario registrado. Tiene acceso al Panel Administrativo.
*   **User**: Acceso a banca personal, transferencias y perfil.

---

## 📁 Estructura del Proyecto

```
/
├── backend/            # API REST, Controladores y Lógica
├── frontend/           # Aplicación Web React (Vite)
├── mobile/             # App Móvil React Native (Expo)
├── database/           # Scripts SQL para Supabase/Postgres
└── docker-compose.yml  # Configuración de servicios locales
```

---

## 📧 Pruebas de Correo
Al registrarte, revisa la consola (terminal) del **backend**. Verás un enlace de **Ethereal Email** donde puedes previsualizar el correo de bienvenida generado.

---

Desarrollado por el equipo de arquitectura senior de Lumina Bank.
