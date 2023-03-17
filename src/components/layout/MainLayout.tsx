import { type ReactNode, type FC } from 'react'
import { Footer, Header } from './'

interface Props {
    children: ReactNode,
    menuSiempreBlanco?: boolean
}

export const MainLayout: FC<Props> = ({ children, menuSiempreBlanco = false }) => {
    return (
        <>
            <Header menuSiempreBlanco={menuSiempreBlanco} />
            {children}
            <Footer />
        </>
    )
}
