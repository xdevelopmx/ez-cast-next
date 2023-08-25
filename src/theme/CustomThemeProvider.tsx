import { type FC, type ReactNode } from "react"
import { ThemeProvider } from "@emotion/react"
import { createTheme, CssBaseline } from "@mui/material";
import * as locales from '@mui/material/locale';

interface Props {
    children: ReactNode;
}


const theme = createTheme({
    typography: {
        fontFamily: 'Gill Sans',
        fontSize: 16
    },
    palette: {
        primary: {
            main: '#069CB1'
        }
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: `
              @font-face {
                font-family: 'Gill Sans';
                src: url('../../public/assets/fonts/GillSans-Light.woff2') format('woff2');
                font-weight: 100;
                font-style: normal;
              }
              
              @font-face {
                font-family: 'Gill Sans';
                src: url('../../public/assets/fonts/GillSans-Light.woff2') format('woff2');
                font-weight: 200;
                font-style: normal;
              }
              
              @font-face {
                font-family: 'Gill Sans';
                src: url('../../public/assets/fonts/GillSans-Light.woff2') format('woff2');
                font-weight: 300;
                font-style: normal;
              }
              
              @font-face {
                font-family: 'Gill Sans';
                src: url('../../public/assets/fonts/GillSans.woff2') format('woff2');
                font-weight: 400;
                font-style: normal;
              }
              
              @font-face {
                font-family: 'Gill Sans';
                src: url('../../public/assets/fonts/GillSans-SemiBold.woff2') format('woff2');
                font-weight: 500;
                font-style: normal;
              }
              
              @font-face {
                font-family: 'Gill Sans';
                src: url('../../public/assets/fonts/GillSans-SemiBold.woff2') format('woff2');
                font-weight: 600;
                font-style: normal;
              }
              
              @font-face {
                font-family: 'Gill Sans';
                src: url('../../public/assets/fonts/GillSans-Bold.woff2') format('woff2');
                font-weight: 700;
                font-style: normal;
              }
              
              @font-face {
                font-family: 'Gill Sans';
                src: url('../../public/assets/fonts/GillSans-Bold.woff2') format('woff2');
                font-weight: 800;
                font-style: normal;
              }
              
              @font-face {
                font-family: 'Gill Sans';
                src: url('../../public/assets/fonts/GillSans-UltraBold.woff2') format('woff2');
                font-weight: 900;
                font-style: normal;
              }
          `,
        },
    },
}, 
    locales['esES']
);

export const CustomThemeProvider: FC<Props> = ({ children }) => {
    return (
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    )
}
