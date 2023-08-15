import { type ComponentProps } from "react";
import Image from "next/image";

type Props = {
  inputProps?: ComponentProps<"input">;
  buttonProps?: ComponentProps<"button">;
};

export const Buscador = ({ inputProps, buttonProps }: Props) => {
  return (
    <div
      style={{
        position: "relative",
      }}
    >
      <input {...(inputProps ?? {})} />

      <button
        {...buttonProps}
        style={{
          position: "absolute",
          top: "50%",
          right: "10px",
          transform: "translate(0,-50%)",
          border: "none",
          backgroundColor: "transparent",
        }}
      >
        <Image
          src={"/assets/img/iconos/search_blue.png"}
          width={15}
          height={15}
          alt=""
        />
      </button>
    </div>
  );
};
