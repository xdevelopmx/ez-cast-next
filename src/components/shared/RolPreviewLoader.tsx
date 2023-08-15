import { Grid } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";

export const RolPreviewLoader = () => {
  return (
    <Grid item container xs={12} sx={{ border: "2px solid #928F8F" }}>
      <Grid container item xs={12} sx={{ alignItems: "flex-start" }}>
        <Grid item xs={4}>
          <Skeleton
            variant="rectangular"
            sx={{
              width: "100%",
              aspectRatio: "16/12",
              minHeight: 200,
              backgroundColor: "#a9a9a9",
            }}
          />
        </Grid>
        <Grid container item xs={8} sx={{ padding: "20px" }}>
          <Skeleton
            variant="rectangular"
            width={"50%"}
            sx={{ backgroundColor: "#a9a9a9" }}
          />
          <Skeleton
            variant="rectangular"
            width={"100%"}
            sx={{ backgroundColor: "#a9a9a9", marginTop: 1 }}
          />
          <Skeleton
            variant="rectangular"
            width={"100%"}
            height={100}
            sx={{ backgroundColor: "#a9a9a9", marginTop: 1 }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};
