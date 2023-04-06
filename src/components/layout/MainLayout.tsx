
import { type ReactNode, type FC, type CSSProperties, useContext } from 'react'
import { Footer, Header } from './'
import AppContext from '~/context/app'
import { LoadingPage } from '../shared'

interface Props {
    children: ReactNode,
    menuSiempreBlanco?: boolean,
    style?: CSSProperties
}

export const MainLayout: FC<Props> = ({ children, menuSiempreBlanco = false, style }) => {
    const { isLoadingData } = useContext(AppContext)
    console.log(isLoadingData);
    return (
        <>
            <Header menuSiempreBlanco={menuSiempreBlanco} />
            <div style={{ marginTop: 76, ...style }}>
                {isLoadingData ? <LoadingPage /> : children}
            </div>
            <Footer />
        </>
    )
}
