import { type ReactNode, type FC, Children, CSSProperties } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

import { Navigation, Pagination } from 'swiper';

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
}

export const Carroucel: FC<Props> = ({ arrowsColor, className, children, slidesPerView = 5, spaceBetween = 0, navigation = true }) => {

    const slides = Children.map(children, (child, i) => (
        <SwiperSlide key={i}>{child}</SwiperSlide>
    ))

    return (
        <Swiper
            style={{
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                '--swiper-theme-color': arrowsColor
            }}
            modules={[Navigation, Pagination]}
            spaceBetween={spaceBetween}
            slidesPerView={slidesPerView}
            navigation={navigation}
            onSlideChange={() => console.log('slide change')}
            //onSwiper={(swiper) => console.log(swiper)}
        >
            {slides}
        </Swiper>

    )
}
