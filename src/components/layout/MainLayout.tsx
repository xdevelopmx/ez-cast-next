
import { type ReactNode, type FC, CSSProperties } from 'react'
import { Footer, Header } from './'

interface Props {
    children: ReactNode,
    menuSiempreBlanco?: boolean,
    style?: CSSProperties
}

export const MainLayout: FC<Props> = ({ children, menuSiempreBlanco = false, style }) => {
    return (
        <>
            <Header menuSiempreBlanco={menuSiempreBlanco} />
            <div style={{marginTop: 76, ...style}}>
                {children}
            </div>
            <Footer />
        </>
    )
}
