import { Box, IconButton, SxProps, Theme } from "@mui/material"
import DualDatePicker from "./DualDatePicker/DualDatePicker"
import { api } from "~/utils/api"
import { useMemo } from "react"
import { Close } from "@mui/icons-material"

const estilos_calendario: SxProps<Theme> = {
    '& .MuiPickersCalendarHeader-label': {
        fontWeight: 'bold'
    },
    '& .MuiDayCalendar-weekDayLabel': {
        color: '#069cb1',
        fontWeight: 'bold',
        margin: 0,
        borderBottom: '2px solid #069cb1',
        fontSize: '1rem'
    },
    '& .MuiDayCalendar-header': {

    },
    '& .MuiPickersDay-root': {
        margin: 0,
        fontWeight: 'bold',
        fontSize: '1rem'
    },
    '& .MuiPickersDay-today': {
        borderRadius: 0,
        backgroundColor: '#FCD081',
        color: '#000',
        border: 'none'
    },
    '& .Mui-selected, & .Mui-selected:hover, & .Mui-selected:focus': {
        borderRadius: 0,
        backgroundColor: '#9CF2FD',
        color: '#000',
        border: 'none'
    }
}

export const CalendarPreview = (props: {width: string | number, onClose: () => void}) => {

    const fechas_asignadas = api.agenda_virtual.getAllFechasAsignadas.useQuery(undefined, {
        refetchOnWindowFocus: false
    })

    const fechas_arr = useMemo(() => {
        const res: {day: number, month: number, year: number, tipo_agenda: string}[] = [];
        if (fechas_asignadas.data) {
            fechas_asignadas.data.forEach((b) => {
                res.push({
                    day: b.fecha.getDate(), 
                    month: b.fecha.getMonth() + 1, 
                    year: b.fecha.getFullYear(), 
                    tipo_agenda: b.tipo_agenda
                });
            })
        }
        return res;
    }, [fechas_asignadas.data]);

    return (
        <Box position={'relative'} width={props.width} sx={{backgroundColor: 'white', border: 'solid', borderColor: '#069cb1'}} >
            <IconButton 
                sx={{
                    position: 'absolute',
                    right: 0,
                    top: 0
                }}
                onClick={props.onClose}
            >
                <Close/>
            </IconButton>
            <DualDatePicker 
                is_dual={false}
                selected_dates={fechas_arr}
                direction="horizontal" 
                sx={estilos_calendario}
            />
        </Box>
    )
}