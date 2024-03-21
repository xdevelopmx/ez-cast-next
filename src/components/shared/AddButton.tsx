import { type CSSProperties, type FC } from "react";
import Image from "next/image";

const styles: CSSProperties = {
  marginTop: 16,
  marginLeft: 0,
  padding: 4,
  fontWeight: 800,
  color: "#069cb1",
  width: 200,
};

interface Props {
  onClick: (...args: unknown[]) => unknown;
  text?: string;
  aStyles?: CSSProperties;
  className?: string;
  imageClassName?: string;
  imageStyles?: CSSProperties;
}

export const AddButton: FC<Props> = ({
  onClick,
  text = "Agregar",
  aStyles = {},
  className = "",
  imageClassName = "",
  imageStyles = {},
}) => {
  return (
    <a
      onClick={onClick}
      style={{ ...styles, width: "150px", ...aStyles }}
      className={`btn  btn-social ${className}`}
    >
      <Image
        width={16}
        height={16}
        className={`mr-2 ${imageClassName}`}
        style={imageStyles}
        src="/assets/img/iconos/cruz_blue.svg"
        alt="Boton de agregar credito"
      />
      {text}
    </a>
  );
};
