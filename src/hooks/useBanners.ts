import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export type Banner = {
    content: {
        position: string,
        isButton: boolean,
        text: string,
        redirect_url: string
    },
    type: 'video' | 'image',
    url_content: string,
    id: string,
    ref: string
}

const useBanners = (ref: string) => {
    const [banners, setBanners] = useState<Banner[]>([]);
    const getBanners = async () => {
        const result = await (await fetch('https://elasticbeanstalk-us-east-1-232555073760.s3.amazonaws.com/banners.json')).json() as {banners: Banner[]};
        if (result.banners.length > 0) {
            setBanners(result.banners.filter(b => b.ref.includes(ref)));
        }
    }

    useEffect(() => {
        getBanners();
    }, [ref]);
    
    return banners;
};

export default useBanners;