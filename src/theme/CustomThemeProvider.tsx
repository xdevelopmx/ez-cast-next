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
    components: {
        MuiCssBaseline: {
            
        },
        MuiTypography: {
            defaultProps: {
                fontFamily: 'GillSans'
            },
            styleOverrides: {
                root: {
                    fontFamily: 'GillSans'
                }
            }
        }
    },
});

export const CustomThemeProvider: FC<Props> = ({ children }) => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    )
}
