import { Box, InputLabel, MenuItem, Select } from "@mui/material"
import { useContext } from "react";
import AppContext from "~/context/app";
import useLang from "~/hooks/useLang";

export function CalificacionOrderSelect (props: {value: string, onChange: (order: string) => void, justifyContent: 'start' | 'end' | 'center'}) {
    const ctx = useContext(AppContext);
    const textos = useLang(ctx.lang);
    return (
        <Box sx={{ m: 1, gap: 2, minWidth: 120, display: 'flex', flexDirection: 'row', justifyContent: props.justifyContent }}>

            <InputLabel id="demo-simple-select-standard-label">{textos['order_by_rating']}</InputLabel>
            <Select
                value={props.value}
                variant='standard'
                onChange={(value) => { 
                    props.onChange(value.target.value);
                }}
            >
                <MenuItem value={'asc'}>{textos['ascendant']}</MenuItem>
                <MenuItem value={'desc'}>{textos['descendant']}</MenuItem>
            </Select>
        </Box>
    )
}