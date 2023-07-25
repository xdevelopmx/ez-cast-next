import { Badge, Box, Divider, IconButton, SxProps, Typography } from "@mui/material";
import { DateCalendar, LocalizationProvider, PickersDay, PickersDayProps } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { esES } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { AnimatePresence, AnimateSharedLayout, color, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { MContainer } from "../../layout/MContainer";
import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { MTooltip } from "../MTooltip";
import classes from './DualDatePicker.module.css';

function getInitialDates() {
    const d = new Date().toLocaleDateString('es-mx').split('/');
    let date = dayjs();
    let secondDate = dayjs();
    if (d[0] && d[1] && d[2]) {
        date = dayjs(`${parseInt(d[0]) > 10 ? d[0] : `0${d[0]}`}/${parseInt(d[1]) > 10 ? d[1] : `0${d[1]}`}/${d[2]}`, 'DD/MM/YYYY');
    }
    const d2 = new Date();
    d2.setMonth(d2.getMonth() + 1);
    const date2 = d2.toLocaleDateString('es-mx').split('/');
    if (date2[0] && date2[1] && date2[2]) {
        secondDate = dayjs(`${parseInt(date2[0]) > 10 ? date2[0] : `0${date2[0]}`}/${parseInt(date2[1]) > 10 ? date2[1] : `0${date2[1]}`}/${date2[2]}`, 'DD/MM/YYYY');
    }

    return [date, secondDate];
}

export default function DualDatePicker(props: {
    sx: SxProps,
    direction: 'vertical' | 'horizontal',
    selected_dates: {day: number, month: number, year: number, tipo_agenda: string}[],
    is_dual: boolean
}) {
    const [dates, setDates] = useState<(Dayjs | null | undefined)[]>(getInitialDates());
    
    const [highlightedDaysDateOne, setHighlightedDaysDateOne] = useState<{fecha: number[], tipo_agenda: string}[]>(props.selected_dates.filter(d => {
        if (dates[0]) {
            return d.month === dates[0].month() + 1;
        }
        return false;
    }).map(d => { return { fecha: [d.day, d.month, d.year], tipo_agenda: d.tipo_agenda}}));

    const [highlightedDaysDateTwo, setHighlightedDaysDateTwo] = useState<{fecha: number[], tipo_agenda: string}[]>(props.selected_dates.filter(d => {
        if (dates[1]) {
            return d.month === dates[1].month() + 1;
        }
        return false;
    }).map(d => { return { fecha: [d.day, d.month, d.year], tipo_agenda: d.tipo_agenda}}));

    useEffect(() => {
        setHighlightedDaysDateOne(props.selected_dates.filter(d => {
            if (dates[0]) {
                return d.month === dates[0].month() + 1;
            }
            return false;
        }).map(d => { return { fecha: [d.day, d.month, d.year], tipo_agenda: d.tipo_agenda}}));
        setHighlightedDaysDateTwo(props.selected_dates.filter(d => {
            if (dates[1]) {
                return d.month === dates[1].month() + 1;
            }
            return false;
        }).map(d => { return { fecha: [d.day, d.month, d.year], tipo_agenda: d.tipo_agenda}}));
    }, [props.selected_dates, dates[1], dates[0]]);


    const ServerDay = (props: PickersDayProps<Dayjs> & { highlightedDaysDateOne?: {fecha: number[], tipo_agenda: string}[], highlightedDaysDateTwo?: {fecha: number[], tipo_agenda: string}[] }) => {
        const { highlightedDaysDateOne = [], highlightedDaysDateTwo = [], day, outsideCurrentMonth, ...other } = props;


        const selected_one = highlightedDaysDateOne.filter(d => {
            return d.fecha[0] === day.date() && d.fecha[1] === day.month() + 1 && d.fecha[2] === day.year()
        });

        const selected_two = highlightedDaysDateTwo.filter(d => {
            return d.fecha[0] === day.date() && d.fecha[1] === day.month() + 1 && d.fecha[2] === day.year()
        });


        const isSelected = !props.outsideCurrentMonth && (selected_one.length > 0 || selected_two.length > 0);
      
        let color_background = '';
        if (selected_one.length > 0) {
            switch(selected_one[0]?.tipo_agenda.toLowerCase()) {
                case 'audicion': color_background = '#069cb1!important'; break;
                case 'callback': color_background = '#F9B233!important'; break;
                case 'ambas': color_background = 'linear-gradient(to right,#069cb1 0%,#069cb1 50%,#F9B233 50%,#F9B233 100%)!important'; break;
            }
        }

        if (selected_two.length > 0) {
            switch(selected_two[0]?.tipo_agenda.toLowerCase()) {
                case 'audicion': color_background = '#069cb1!important'; break;
                case 'callback': color_background = '#F9B233!important'; break;
                case 'ambas': color_background = 'linear-gradient(to right,#069cb1 0%,#069cb1 50%,#F9B233 50%,#F9B233 100%)!important'; break;
            }
        }

        return (
            <>
                {isSelected &&
                    <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} sx={{background: color_background}} selected day={day} />
                }
    
                {!isSelected && <PickersDay {...other} selected={true} sx={{backgroundColor: 'transparent!important', color: 'black!important'}} outsideCurrentMonth={outsideCurrentMonth} day={day} />}
            </>
          
        );
    }

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0, transition: { duration: 0.15 } }}
			transition={{ duration: 0.2, delay: 0.15 }}
			style={{ pointerEvents: "auto", width: '100%' }}
			className="overlay"
		>
			<LocalizationProvider
                dateAdapter={AdapterDayjs}
                localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}
                adapterLocale={'es-mx'}
            >
                <MContainer styles={{borderColor: 'red'}} direction={props.direction}>
                    <IconButton 
                        onClick={() => {
                            let date = dates[0];
                            let date_two = dates[1];
                            if (date && date_two) {
                                let n_date = date.toDate();
                                n_date.setMonth(n_date.getMonth() - 1);
                                let n_date_two = date_two.toDate();
                                n_date_two.setMonth(n_date_two.getMonth() - 1);
                                setDates(prev => { return [dayjs(n_date), dayjs(n_date_two)]});
                            } 
                        }}
                        style={{width: '4%', color: '#4ab7c6', height: 56, marginTop: 'auto', marginBottom: 'auto'}}
                     >
                        <ArrowBackIosNewIcon/>
                    </IconButton>
                    <Box sx={{
                        width: (props.is_dual) ? '40%' : '90%',
                        paddingLeft: 8,
                        paddingRight: 8
                    }}>
                        <div id="dualpicker">
                            <DateCalendar
                                views={['day']}
                                autoFocus={false}
                                slots={{
                                    day: ServerDay,
                                }}
                                slotProps={{
                                    day: {
                                        highlightedDaysDateOne,
                                    } as any,
                                }}
                                sx={{
                                    ...props.sx,
                                }}
                                value={dates[0]}
                            />

                        </div>
                        
                    </Box>
                    {props.is_dual &&
                        <>
                        
                            <Divider 
                                style={{
                                    marginLeft: '5%',
                                    marginRight: '5%',
                                    marginTop: 'auto',
                                    marginBottom: 'auto',
                                    height: (props.direction === 'horizontal') ? '180px' : '2px'
                                }}
                                sx={{
                                    border: '2px solid #069cb1'
                                }} 
                                orientation={props.direction === 'vertical' ? 'horizontal' : 'vertical' } />
                            <Box sx={{
                                width: '40%',
                                paddingLeft: 8,
                                paddingRight: 8
                            }}>
                                <div id="dualpicker">
                                    <DateCalendar
                                        className="dualpicker"
                                        views={['day']}
                                        autoFocus={false}
                                        
                                        slots={{
                                            day: ServerDay,
                                        }}
                                        slotProps={{
                                            day: {
                                                highlightedDaysDateTwo,
                                            } as any,
                                        }}
                                        sx={props.sx}
                                        value={dates[1]}
                                    />
                                </div>
                            </Box>
                        </>
                    }
                    <IconButton 
                        onClick={() => {
                            let date = dates[0];
                            let date_two = dates[1];
                            if (date && date_two) {
                                let n_date = date.toDate();
                                n_date.setMonth(n_date.getMonth() + 1);
                                let n_date_two = date_two.toDate();
                                n_date_two.setMonth(n_date_two.getMonth() + 1);
                                setDates(prev => { return [dayjs(n_date), dayjs(n_date_two)]});
                            } 
                        }}
                        style={{width: '4%', color: '#4ab7c6', height: 56, marginTop: 'auto', marginBottom: 'auto'}}
                     >
                        <ArrowForwardIosIcon/>
                    </IconButton>
                </MContainer>
            </LocalizationProvider>

		</motion.div>
	)
}