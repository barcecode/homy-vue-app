export const registerSchema = {
  email(value) {
    if (!value) {
      return 'El email es obligatorio';
    }
    // si es un email válido
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!regex.test(value)) {
      return 'Email no válido';
    }
    return true;
  },
  rEmail(value, ctx) {
    // ctx.form.email es el valor del campo email original
    if (!value) {
      return 'Debes repetir tu email';
    }
    if (value !== ctx.form.email) {
      return 'Los emails no coinciden';
    }
    return true;
  },
  password(value) {
    if (!value) return 'La contraseña es obligatoria'

    const regexLongitud = /^.{8,}$/;

    if (!regexLongitud.test(value)) {
      return 'La contraseña debe tener al menos 8 carácteres'
    }

    const regexFormato = /^[A-Za-z0-9]+$/;

    if (!regexFormato.test(value)) {
      return 'La contraseña solo puede contener letras y números'
    }
    return true;
  },
  rPassword(value, ctx) {
    if (!value) return 'Debes repetir la contraseña';
    if (value !== ctx.form.password) return 'Las contraseñas no coinciden';
    return true;
  }
}
