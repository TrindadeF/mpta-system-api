import logo from "../assets/logo-mpta-cropped.png";

export function BrandLogo({ size = 40 }: { size?: number }) {
  return (
    <img
      src={logo}
      alt="Ministério Profético Tabernáculo da Adoração"
      className="brand-logo"
      style={{ width: size, height: size }}
    />
  );
}
