export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface User {
  id?: string;
  email: string;
  name?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ErrorResponse {
  error: string;
  code: string;
  details?: Array<{
    msg: string;
    param: string;
    location: string;
  }>;
}

// Función para verificar si el servidor está en línea
export const checkServerStatus = async (): Promise<boolean> => {
  try {
    await fetch(`${import.meta.env.VITE_API_URL}/health`, {
      method: "HEAD",
    });
    return true;
  } catch (error) {
    console.error("Error verificando estado del servidor:", error);
    return false;
  }
};

export const login = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  try {
    const isServerOnline = await checkServerStatus();

    if (!isServerOnline) {
      throw new Error(
        "No se puede conectar con el servidor. Verifica tu conexión a internet."
      );
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json" // Agregamos este header para especificar que esperamos JSON
      },
      body: JSON.stringify(credentials),
    });

    // Logging de información de la respuesta
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    console.log('Content-Type:', response.headers.get('content-type'));
    
    const contentType = response.headers.get('content-type');
    const text = await response.text();
    console.log('Response raw text:', text);

    // Verificar si la respuesta es HTML
    if (contentType && contentType.includes('text/html')) {
      throw new Error('El servidor devolvió una página HTML en lugar de JSON. Posible error de autenticación del servidor.');
    }

    if (!text) {
      throw new Error('La respuesta del servidor está vacía');
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('Error al parsear JSON:', e);
      throw new Error(`Error al procesar la respuesta del servidor: ${text.substring(0, 100)}...`);
    }

    if (!response.ok) {
      const errorMsg = getErrorMessage(data);
      throw new Error(errorMsg);
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
      throw new Error(
        "No se puede conectar con el servidor. Verifica tu conexión a internet."
      );
    } else if (error instanceof Error) {
      console.error('Error detallado:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      throw error;
    } else {
      throw new Error("Error de conexión al servidor");
    }
  }
};

export const register = async (
  userData: RegisterCredentials
): Promise<{ userId: string; name: string; email: string }> => {
  try {
    // Verificar conexión con el servidor primero
    const isServerOnline = await checkServerStatus();

    if (!isServerOnline) {
      throw new Error(
        "No se puede conectar con el servidor. Verifica tu conexión a internet."
      );
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      // Extraer mensaje específico según el formato de respuesta
      const errorMsg = getErrorMessage(data);
      throw new Error(errorMsg);
    }

    return data.data;
  } catch (error) {
    // Manejo específico para errores de red
    if (
      error instanceof TypeError &&
      error.message.includes("Failed to fetch")
    ) {
      throw new Error(
        "No se puede conectar con el servidor. Verifica tu conexión a internet."
      );
    } else if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Error de conexión al servidor");
    }
  }
};

export const validateToken = async (
  token: string
): Promise<{ valid: boolean; user?: User }> => {
  try {
    // Si no podemos conectar con el servidor, considerar el token como inválido
    const isServerOnline = await checkServerStatus();

    if (!isServerOnline) {
      console.warn("No se puede validar el token: servidor no disponible");
      return { valid: false };
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/users/validate-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return { valid: false };
    }

    return data;
  } catch (error) {
    console.error("Error validando token:", error);
    return { valid: false };
  }
};

export const getUserProfile = async (token: string): Promise<User> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error al obtener el perfil");
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("Error de conexión al obtener perfil");
    }
  }
};

// Función auxiliar para obtener mensajes de error específicos según el código
function getErrorMessage(errorData: ErrorResponse): string {
  switch (errorData.code) {
    case "MISSING_FIELDS":
      return "Todos los campos son requeridos";
    case "VALIDATION_ERROR":
      // Devolvemos el primer error de validación
      return errorData.details && errorData.details.length > 0
        ? errorData.details[0].msg
        : "Error de validación en los datos";
    case "EMAIL_EXISTS":
      return "El correo electrónico ya está registrado";
    case "MISSING_CREDENTIALS":
      return "Email y contraseña son requeridos";
    case "USER_NOT_FOUND":
      return "El usuario no está registrado";
    case "INVALID_PASSWORD":
      return "Contraseña incorrecta";
    case "SERVER_ERROR":
      return "Error en el servidor, intente más tarde";
    default:
      return errorData.error || "Error desconocido";
  }
}
