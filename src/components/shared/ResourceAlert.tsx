import { Backdrop } from "@mui/material"

export const ResourceAlert = (props: {busy: boolean}) => {
    return (
        <Backdrop
          sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={props.busy}
        >
          <span className="loader"></span>
        </Backdrop>
    )
}