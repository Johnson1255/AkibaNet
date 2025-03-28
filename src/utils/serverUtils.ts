export const checkServerConnection = async (): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos de timeout

    const response = await fetch(`${import.meta.env.VITE_API_URL}/health`, { 
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      console.error('La solicitud al servidor expiró');
    } else {
      console.error('Error de conexión:', error);
    }
    return false;
  }
};
