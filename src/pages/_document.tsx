import { Html, Head, Main, NextScript } from 'next/document'
import { CustomThemeProvider } from '~/theme'

export default function Document() {
    return (
        <Html>
            <Head>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossOrigin="anonymous" />
            </Head>
            <body>
                <CustomThemeProvider>
                    <Main />
                    <NextScript />
                </CustomThemeProvider>
            </body>


        </Html>
    )
}