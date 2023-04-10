import Image from 'next/image'
import { useContext } from "react"
import MotionDiv from "../layout/MotionDiv"
import AppContext from "~/context/app"
import { Box } from "@mui/material"


export const LoadingPage = () => {
    const { isLoadingData } = useContext(AppContext)
    return (
        <MotionDiv show={isLoadingData} animation="fade">
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
        </MotionDiv>
    )
}
