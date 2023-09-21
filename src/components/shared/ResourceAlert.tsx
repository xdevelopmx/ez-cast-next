import { Backdrop } from "@mui/material";
import Image from "next/image";

export const ResourceAlert = (props: { busy: boolean }) => {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 9999 }}
      open={props.busy}
    >
      <span className="loader">
        <Image src="/favicon.ico" width={70} height={70} alt=""/>
      </span>
    </Backdrop>
  );
};
