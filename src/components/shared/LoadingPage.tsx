import Image from 'next/image'
import { Box } from "@mui/material"


export const LoadingPage = () => {
    return (
        <Box sx={{
            position: 'relative',
            width: '100%',
            height: '80vh'
        }}>
            <Image
                src={'/assets/img/posterhome.png'}
                style={{
                    objectFit: 'cover'
                }}
                fill
                alt="loading-image"
            />
        </Box>
    )
}
