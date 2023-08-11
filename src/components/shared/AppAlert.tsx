import { Typography } from "@mui/material";
import { motion } from "framer-motion";
import Image from "next/image";
import { useMemo } from "react";

type AppAlertProps = {
  imageSrc: string;
  title: string;
  size: "xs" | "sm" | "md" | "lg" | "xl";
  message: string;
};

export default function AppAlert(props: AppAlertProps) {
  const sizes = useMemo(() => {
    switch (props.size) {
      case "xs":
        return { title: 8, text: 6 };
      case "sm":
        return { title: 12, text: 8 };
      case "md":
        return { title: 16, text: 10 };
      case "lg":
        return { title: 20, text: 12 };
      case "xl":
        return { title: 24, text: 16 };
    }
  }, [props.size]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      transition={{ duration: 0.2, delay: 0.15 }}
      style={{ pointerEvents: "auto" }}
      className="overlay"
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          padding: 4,
        }}
      >
        <Image
          src={props.imageSrc}
          style={{ maxWidth: 128 }}
          width={128}
          height={128}
          className="card-img-top"
          alt={props.title}
        />
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          padding: 4,
        }}
      >
        <Typography fontSize={sizes.title}>{props.title}</Typography>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          padding: 4,
        }}
      >
        <Typography fontSize={sizes.text}>{props.message}</Typography>
      </div>
    </motion.div>
  );
}
