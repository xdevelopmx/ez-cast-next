import { Skeleton, Typography } from "@mui/material";
import React from "react";
import { MContainer } from "~/components/layout/MContainer";

export const LoaderSlide = () => {
  return (
    <MContainer direction="vertical">
      <Skeleton variant="rectangular" height={330} />
      <Typography
        sx={{
          padding: "20px 0 0 0",
          fontWeight: "800",
          lineHeight: "1.2",
          fontSize: "23px",
        }}
        style={{ cursor: "pointer" }}
        align="center"
        variant="subtitle1"
      >
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
      </Typography>
    </MContainer>
  );
};
