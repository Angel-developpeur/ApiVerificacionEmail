# Proyecto de Verificación de Email con NestJS y Firebase

Este proyecto es una API construida con NestJS que gestiona un flujo de verificación de correo electrónico mediante un sistema de doble factor: un código numérico enviado al email del usuario y un token de API. Utiliza Firebase Firestore como base de datos y Resend para el envío de correos transaccionales.

Este proyecto es una migración y modernización de una funcionalidad originalmente implementada en Laravel.

## Requisitos Previos

- **Node.js**: Se recomienda la versión 22 o superior. El proyecto fue desarrollado y probado con v22.
- **npm**: Gestor de paquetes de Node.js.
- **Cuenta de Firebase**: Un proyecto activo en Firebase con las credenciales de servicio.
- **Cuenta de Resend**: Una cuenta activa en Resend y una API key.

## Configuración Inicial

1.  **Clonar el Repositorio:**
    ```bash
    git clone https://github.com/Angel-developpeur/ApiVerificacionEmail.git
    cd email-verification-nest-js
    ```

2.  **Instalar Dependencias:**
    ```bash
    npm install
    ```

3.  **Configurar Firebase:**
    -   Obtén tu archivo de credenciales de cuenta de servicio desde la consola de Firebase (`Project settings` > `Service accounts` > `Generate new private key`).
    -   Renombra este archivo a `firebase-credentials.json` y colócalo en la **raíz del proyecto**.

4.  **Configurar Resend:**
    -   Abre el archivo `src/mailer/mailer.service.ts`.
    -   Reemplaza la API key de ejemplo con tu propia API key de Resend.
    ```typescript
    // src/mailer/mailer.service.ts
    this.resend = new Resend('re_TU_API_KEY_AQUI');
    ```

5.  **Iniciar la Aplicación:**
    ```bash
    npm run start:dev
    ```
    La API se ejecutará en `http://localhost:3000`.

## Estructura del Proyecto

El proyecto sigue la arquitectura estándar de NestJS, separando la lógica en módulos:

-   `src/main.ts`: Punto de entrada de la aplicación.
-   `src/app.module.ts`: Módulo raíz que importa todos los demás módulos.
-   `src/auth/`: Contiene toda la lógica de negocio para la verificación.
    -   `auth.controller.ts`: Define los endpoints de la API (`/send-code`, `/validate-code`).
    -   `auth.service.ts`: Implementa la lógica para generar tokens, guardar en la base de datos y validar.
    -   `auth.module.ts`: Declara el módulo de autenticación.
-   `src/firebase/`: Gestiona la conexión con Firebase.
    -   `firebase.service.ts`: Inicializa el SDK de Firebase Admin y proporciona acceso a Firestore.
-   `src/mailer/`: Se encarga del envío de correos.
    -   `mailer.service.ts`: Contiene la lógica para enviar correos usando la API de Resend.

## Base de Datos - Firebase Firestore

La aplicación utiliza una colección en Firestore para almacenar temporalmente los códigos de verificación.

-   **Colección:** `auth_codes`

-   **Estructura del Documento:** Cada vez que un usuario solicita un código, se crea un nuevo documento en esta colección con la siguiente estructura:
    ```json
    {
      "email": "usuario@ejemplo.com",
      "numeric_code": "123456",
      "api_token": "un_token_hexadecimal_largo",
      "is_validated": false,
      "expires_at": "Timestamp de expiración (10 min)",
      "created_at": "Timestamp de creación"
    }
    ```
-   **Limpieza Automática:** Una vez que un código es validado correctamente, el documento correspondiente es **eliminado** de la colección para no almacenar datos innecesarios.

### Índice Compuesto Requerido

Para que la consulta de validación funcione, Firestore necesita un **índice compuesto**. La forma más fácil de crearlo es:

1.  Ejecuta la aplicación por primera vez y haz una petición al endpoint `POST /auth/validate-code`.
2.  La petición fallará y en la consola de NestJS verás un error `FAILED_PRECONDITION` con un enlace.
3.  Copia y pega ese enlace en tu navegador. Te llevará a la consola de Firebase con el índice pre-configurado.
4.  Haz clic en **"Crear índice"** y espera a que su estado sea "Habilitado".

## API Endpoints

### 1. Enviar Código de Verificación

Este endpoint inicia el proceso. Genera un código numérico y un token, los guarda en Firestore y envía el código numérico por correo.

-   **Endpoint:** `POST /auth/send-code`
-   **Body (Request):**
    ```json
    {
      "email": "tu.correo@ejemplo.com"
    }
    ```
-   **Body (Success Response):**
    ```json
    {
      "message": "Code sent successfully",
      "apiToken": "a1b2c3d4e5f6..."
    }
    ```
    Debes guardar este `apiToken` en el cliente para usarlo en el siguiente paso.

### 2. Validar el Código

Este endpoint verifica que tanto el código numérico (del correo) como el token de API (de la respuesta anterior) son correctos.

-   **Endpoint:** `POST /auth/validate-code`
-   **Body (Request):**
    ```json
    {
      "email": "tu.correo@ejemplo.com",
      "code": "123456",
      "apiToken": "a1b2c3d4e5f6..."
    }
    ```
-   **Body (Success Response):**
    ```json
    {
      "isValid": true
    }
    ```
-   **Body (Failure Response):**
    ```json
    {
      "isValid": false
    }
    ```

## Integración con Resend

El servicio de correo está implementado en `src/mailer/mailer.service.ts`.

### Configuración de la API Key

La API key se establece directamente en el constructor del servicio. Para un entorno de producción, se recomienda encarecidamente mover esta clave a una variable de entorno y cargarla a través del `ConfigModule` de NestJS.

### Envío a Cualquier Correo (Verificación de Dominio)

Resend tiene una política de seguridad para prevenir el spam. Por defecto, solo puedes enviar correos **a la dirección de email asociada a tu propia cuenta de Resend**.

Para poder enviar correos a cualquier usuario, necesitas:

1.  **Tener un dominio propio** (ej. `mi-empresa.com`).
2.  **Verificar tu dominio en el dashboard de Resend.** Esto implica añadir unos registros DNS (DKIM, SPF) que Resend te proporcionará.
3.  Una vez verificado, puedes cambiar el remitente (`from`) en `mailer.service.ts` para usar tu dominio.

    ```typescript
    // src/mailer/mailer.service.ts
    const { data, error } = await this.resend.emails.send({
      from: 'Tu Nombre <no-reply@tu-dominio-verificado.com>',
      to: [to],
      // ...
    });
    ```
El remitente `onboarding@resend.dev` es un dominio especial proporcionado por Resend únicamente para fines de desarrollo y prueba.
