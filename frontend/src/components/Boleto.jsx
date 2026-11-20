// Entrada de circo: en el login es "entrar a la función" y en el menú lleva tu número de socio.
// numero: el número del usuario, o nada si todavía no se sabe quién es (login).
// abajo: true la cuelga de la esquina inferior izquierda en vez de la superior derecha.
export default function Boleto({ numero, abajo = false }) {
  // le pego ceros adelante y me quedo con los últimos 6 caracteres: 2 -> "000002"
  const texto = numero ? ("000000" + numero).slice(-6) : "??????";

  return (
    <div className={"boleto" + (abajo ? " abajo" : "")} aria-hidden={!numero}>
      <span className="boleto-arriba">Admite uno</span>
      <strong>Gran función</strong>
      <span className="boleto-titulo">Desafío Mental</span>
      <span className="boleto-numero">N° {texto}</span>
    </div>
  );
}
