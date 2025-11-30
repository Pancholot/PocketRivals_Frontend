export const traducirError = (msg: string = "") => {
  const texto = msg.toLowerCase().trim();

  // ------------ REGISTRO ------------
  if (texto.includes("missing information")) {
    return "Por favor completa todos los campos.";
  }

  if (texto.includes("player already registered")) {
    return "Este usuario o correo ya está registrado.";
  }

  if (texto.includes("Player created")) {
    return "Usuario creado exitosamente.";
  }

  // ------------ LOGIN ------------
  if (texto.includes("log in information missing")) {
    return "Ingresa tu correo y contraseña.";
  }

  if (texto.includes("player not found")) {
    return "No existe una cuenta con ese correo.";
  }

  if (texto.includes("incorrect password")) {
    return "La contraseña es incorrecta.";
  }

  // ------------ CHANGE USERNAME ------------
  if (texto.includes("username missing")) {
    return "Ingresa un nuevo nombre de usuario.";
  }

  if (texto.includes("username already taken")) {
    return "Ese nombre de usuario ya está en uso.";
  }

  if (texto.includes("username updated successfully")) {
    return "Tu nombre de usuario ha sido actualizado.";
  }

  // ------------ ERRORES GENÉRICOS ------------
  if (texto.includes("duplicate") || texto.includes("1062")) {
    return "Ya existe un registro duplicado.";
  }

  if (texto.includes("failed") || texto.includes("error")) {
    return "Ocurrió un error. Inténtalo más tarde.";
  }

  if (texto.includes("missing") || texto.includes("required")) {
    return "Faltan datos por completar.";
  }

  if (texto.includes("server") || texto.includes("database")) {
    return "Error en el servidor. Intenta más tarde.";
  }

  return msg;
};
