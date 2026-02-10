import logo from "../assets/logo/logo-2.jpg";

export default function Logo({ size = 200 }) {
  return (
    <img
      src={logo}
      alt="XL Convenience Store"
      style={{ width: size }}
      className="mx-auto"
    />
  );
}
