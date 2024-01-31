import { Box } from "@mui/material";

export default function MAlert(props: {title: JSX.Element | string, body: JSX.Element | string}) {
    return (
        <Box className="container_list_proyects">
            <div
                style={{ width: "80%" }}
                className="box_message_blue"
            >
                {typeof props.title === 'string' && <p className="h3" style={{ fontWeight: 600 }}>{props.title as string}</p>}
                {typeof props.title !== 'string' && props.title}
                {typeof props.title === 'string' && <p style={{ fontSize: 16, textAlign: "center" }}>{props.body as string}</p>}
                {typeof props.title !== 'string' && props.body}
            </div>
        </Box>
    )
}