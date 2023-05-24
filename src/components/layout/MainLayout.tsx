
import { type ReactNode, type FC, type CSSProperties, useContext } from 'react'
import { Footer, Header } from './'
import AppContext from '~/context/app'
import { LoadingPage } from '../shared'
import MotionDiv from './MotionDiv'

interface Props {
    children: ReactNode,
    menuSiempreBlanco?: boolean,
    style?: CSSProperties
}

export const MainLayout: FC<Props> = ({ children, menuSiempreBlanco = false, style }) => {
    const { isLoadingData } = useContext(AppContext)
    return (
        <>
            <Header menuSiempreBlanco={menuSiempreBlanco}  />
            <div style={{ marginTop: 76, ...style }}>
                <MotionDiv show={isLoadingData} animation="fade">
                    <LoadingPage />
                </MotionDiv>
                <MotionDiv show={!isLoadingData} animation="fade">
                    <div>
                        {children}
                    </div>
                </MotionDiv>
            </div>
            <Footer />
        </>
    )
}
