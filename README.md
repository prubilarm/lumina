# ATM Premium - Sistema de Cajero Automático Profesional

Este es un sistema completo de Cajero Automático (ATM) que incluye un Backend robusto en Node.js, una Base de Datos MySQL dockerizada, una interfaz Web profesional en React y una aplicación móvil para transferencias.

## 🚀 Características

- **Seguridad**: Autenticación con JWT y encriptación de contraseñas con bcrypt.
- **Backend**: Arquitectura modular por capas (Controllers, Routes, Middlewares).
- **Frontend Web**: Dashboard moderno, consulta de saldo, retiros, depósitos e historial.
- **App Móvil**: Realización de transferencias y consulta de movimientos.
- **Infraestructura**: Despliegue simplificado con Docker Compose.

---

## 🛠️ Tecnologías Usadas

- **Backend**: Node.js, Express, MySQL, Docker.
- **Frontend**: React, Vite, Axios, Lucide React.
- **Mobile**: React Native (Expo).
- **Base de Datos**: MySQL 8.0.

---

## ⚙️ Instalación y Ejecución

### 1. Requisitos Previos
- [Docker & Docker Desktop](https://www.docker.com/products/docker-desktop)
- [Node.js](https://nodejs.org/) (v18 o superior)

### 2. Levantar la Infraestructura (Backend + DB)

Desde la raíz del proyecto ejecutiva:
```bash
docker-compose up --build
```
Esto levantará la base de datos en el puerto `3306` y el servidor API en el puerto `5000`.

### 3. Ejecutar Frontend (Web)

Desde la carpeta `frontend`:
```bash
npm install
npm run dev
```
Accede a `http://localhost:5173`.

### 4. Ejecutar Mobile App

Desde la carpeta `mobile`:
```bash
npm install
npx expo start
```

---

## 🧪 Datos de Prueba

El sistema incluye dos cuentas iniciales:

1. **Usuario 1:**
   - Email: `juan@example.com`
   - Password: `password123`
   - Saldo Inicial: $5,000

2. **Usuario 2:**
   - Email: `maria@example.com`
   - Password: `password123`
   - Saldo Inicial: $2,500

---

## 📁 Estructura del Proyecto

```
/
├── backend/            # API REST en Node.js
├── frontend/           # Interface Web en React
├── mobile/             # App Móvil en React Native
├── database/           # Scripts SQL de inicialización
├── docker-compose.yml  # Orquestación de contenedores
└── README.md           # Documentación
```

---

## 📜 Licencia
Desarrollado con ❤️ para fines demostrativos de ingeniería de software.
