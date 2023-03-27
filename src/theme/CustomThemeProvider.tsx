import { type FC, type ReactNode } from "react"
import { ThemeProvider } from "@emotion/react"
import { createTheme, CssBaseline } from "@mui/material";

interface Props {
    children: ReactNode;
}


const theme = createTheme({
    typography: {
        fontFamily: 'GillSans, Arial',
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
              font-family: 'GillSans';
              font-style: normal;
              font-display: swap;
              font-weight: 400;
              src: local('GillSans'), local('GillSans'), url(/assets/fonts/GillSans.woff2) format('woff2');
              unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
            }
          `,
        },
    },
});

export const CustomThemeProvider: FC<Props> = ({ children }) => {
    return (
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    )
}
