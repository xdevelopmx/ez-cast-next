import { type ReactNode, type FC, Children, CSSProperties, useState, useEffect, useRef } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

import { Navigation, Pagination } from 'swiper';


/* Cosas  Flechas */
import SwiperCore from "swiper";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Box, IconButton } from '@mui/material';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

interface Props {
    children: ReactNode;
    slidesPerView?: number;
    spaceBetween?: number;
    navigation?: boolean;
    className?: string;
    arrowsColor?: string;
    navigationNew?: boolean;
}

export const Carroucel: FC<Props> = ({ arrowsColor, className, children, slidesPerView = 5, spaceBetween = 0, navigation = true, navigationNew = false }) => {

    const swiperRef = useRef<SwiperCore>();

    const slides = Children.map(children, (child, i) => (
        <SwiperSlide key={i}>{child}</SwiperSlide>
    ))

    return (
        <div className='d-flex carrusel-personalizado'>
            {navigationNew &&
                <IconButton sx={{ margin: '0 0 0 -55px', color: arrowsColor }}
                    onClick={() => swiperRef.current?.slidePrev()} aria-label="delete" size="large">
                    <ArrowBackIosNewIcon fontSize="inherit" />
                </IconButton>
            }
            <Swiper
                style={{
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    '--swiper-theme-color': arrowsColor,
                }}
                modules={[Navigation, Pagination]}
                spaceBetween={spaceBetween}
                slidesPerView={slidesPerView}
                navigation={
                    navigation ? {} : {
                        nextEl: ".home-image-swiper-button-next",
                        prevEl: ".home-image-swiper-button-prev",
                    }
                }
                onBeforeInit={(swiper) => {
                    swiperRef.current = swiper;
                }}
                onSlideChange={() => console.log('slide change')}
            >
                {slides}
            </Swiper>
            {navigationNew &&
                <IconButton sx={{ margin: '0 -55px 0 -25px', color: arrowsColor }} onClick={() => swiperRef.current?.slideNext()} aria-label="delete" size="large">
                    <ArrowForwardIosIcon fontSize="inherit" />
                </IconButton>
            }
        </div>

    )
}
