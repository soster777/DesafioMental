// arma un error con el código HTTP que tiene que responder el servidor (igual que en el ejemplo de clase)
// Number -> String -> [String] -> Error
export function crearError(status, mensaje, errores) {
    return Object.assign(new Error(mensaje), { status: status, errores: errores });
}
