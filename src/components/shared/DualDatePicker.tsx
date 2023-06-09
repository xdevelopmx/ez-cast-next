import { Badge, Box, Divider, IconButton, SxProps, Typography } from "@mui/material";
import { DateCalendar, LocalizationProvider, PickersDay, PickersDayProps } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { esES } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { MContainer } from "../layout/MContainer";
import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { MTooltip } from "./MTooltip";

function getInitialDates() {
    const date = new Date();
    const secondDate = new Date();
    secondDate.setMonth(secondDate.getMonth() + 1);
    return [dayjs(date), dayjs(secondDate)];
}

function ServerDay(props: PickersDayProps<Dayjs> & { highlightedDays?: number[] }) {
    const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;
  
    const isSelected =
      !props.outsideCurrentMonth && highlightedDays.indexOf(props.day.date()) > 0;
  
    return (
        <>
            {isSelected &&
                <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} sx={{backgroundColor: '#fcd081!important'}} selected day={day} />
            }

            {!isSelected && <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />}
            

        </>
      
    );
}

export default function DualDatePicker(props: {
    sx: SxProps,
    direction: 'vertical' | 'horizontal',
    selected_dates: {day: number, month: number, year: number, description: string}[]
}) {
    const [dates, setDates] = useState<(Dayjs | null | undefined)[]>(getInitialDates());
    const [highlightedDaysDateOne, setHighlightedDaysDateOne] = useState(props.selected_dates.filter(d => d.month === dates[0]?.month()).map(d => d.day));
    const [highlightedDaysDateTwo, setHighlightedDaysDateTwo] = useState(props.selected_dates.filter(d => d.month === dates[1]?.month()).map(d => d.day));

    useEffect(() => {
        setHighlightedDaysDateOne(props.selected_dates.filter(d => d.month === dates[0]?.month()).map(d => d.day));
        setHighlightedDaysDateTwo(props.selected_dates.filter(d => d.month === dates[1]?.month()).map(d => d.day));
    }, [props.selected_dates]);

    console.log(props.selected_dates);

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
                        width: '40%',
                        paddingLeft: 8,
                        paddingRight: 8
                    }}>
                        <DateCalendar
                            views={['day']}
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
                        
                    </Box>
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
                        <DateCalendar
                            views={['day']}
                            sx={props.sx}
                            value={dates[1]}
                        />
                    </Box>
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