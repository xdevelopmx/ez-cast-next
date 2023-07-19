import { Search } from "@mui/icons-material"
import { Paper, IconButton, InputBase, Divider, Menu } from "@mui/material"

export const MSearchInput = (props: {placeholder: string, onChange: (value: string) => void}) => {
    return (
        <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400, height: 40 }}
        >
            <InputBase
                onChange={(e) => { props.onChange(e.target.value) }}
                sx={{ ml: 1, flex: 1 }}
                placeholder={props.placeholder}
                inputProps={{ 'aria-label': props.placeholder }}
            />
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                <Search />
            </IconButton>
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        </Paper>
    )
}