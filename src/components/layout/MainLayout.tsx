import { type ReactNode, type FC } from 'react'
import { Footer, Header } from './'

interface Props {
    children: ReactNode
}

export const MainLayout: FC<Props> = ({ children }) => {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    )
}
