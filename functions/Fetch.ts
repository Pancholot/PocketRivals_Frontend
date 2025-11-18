export const get = async (url, params = {}) => {
  try {
    // 1. Construir URL con parámetros (ej: ?limit=20&offset=0)
    const urlObject = new URL(url);
    Object.keys(params).forEach((key) =>
      urlObject.searchParams.append(key, params[key])
    );

    // 2. Hacer el fetch
    const response = await fetch(urlObject.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // 'Authorization': 'Bearer ...' // Aquí podrías agregar tokens si fuera necesario
      },
    });

    // 3. Verificar si la respuesta fue exitosa (Status 200-299)
    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} ${response.statusText}`);
    }

    // 4. Retornar JSON
    return await response.json();
  } catch (error) {
    console.error("Error en GET:", error.message);
    return null; // Retornamos null para que tu UI sepa que falló sin romper todo
  }
};
