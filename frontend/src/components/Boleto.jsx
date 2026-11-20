export default function Boleto({ numero }) {
  const texto = numero ? ("000000" + numero).slice(-6) : "??????";

  return (
    <div className="boleto" aria-hidden={!numero}>
      <span className="boleto-arriba">Admite uno</span>
      <strong>Gran función</strong>
      <span className="boleto-titulo">Desafío Mental</span>
      <span className="boleto-numero">N° {texto}</span>
    </div>
  );
}
