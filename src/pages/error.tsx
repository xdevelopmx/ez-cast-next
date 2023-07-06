import { Home } from "@mui/icons-material";
import { Box, Button, Container } from "@mui/material";
import type { GetServerSideProps, NextPage } from "next"
import { getSession, signIn, signOut, useSession } from "next-auth/react"
import { useRouter } from "next/router";
import { useMemo } from "react";
import { MContainer } from "~/components/layout/MContainer";
import AppAlert from "~/components/shared/AppAlert";
import Constants from "~/constants";

export default function Error() {
	const router = useRouter();
    const cause = useMemo(() => {
        switch (router.query['cause'] as string) {
            case Constants.PAGE_ERRORS.USER_DONT_EXISTS: {
                return <Box className="flex-col text-center">
                    <div className="flex-1">
                        <AppAlert size="xl" title="Problema con el usuario" message="El usuario no existe en la base de datos del sistema" imageSrc={"/assets/img/warning.png"} />
                    </div>
                    <Button endIcon={<Home/>}  onClick={() => { void signOut() } }>Volver al inicio</Button>
                </Box> 
            }
            case Constants.PAGE_ERRORS.UNAUTHORIZED_USER_ROLE: {
                return <MContainer direction="vertical" justify="center" >
                        <AppAlert size="xl" title="Problema con los permisos del usuario" message="El usuario no tiene permisos para ver esta pagina" imageSrc={"/assets/img/warning.png"} />
                    <Button endIcon={<Home/>}  onClick={() => { 
                        void router.replace('/') 
                    } }>Volver al inicio</Button>
                </MContainer> 
            }
            case Constants.PAGE_ERRORS.NO_EDIT_PERMISSIONS: {
                return <MContainer direction="vertical" justify="center" >
                        <AppAlert size="xl" title="Problema con los permisos del usuario" message="El usuario no tiene permisos para editar esta pagina" imageSrc={"/assets/img/warning.png"} />
                    <Button endIcon={<Home/>}  onClick={() => { 
                        void router.replace('/') 
                    } }>Volver al inicio</Button>
                </MContainer> 
            }
        }
    }, [router.query]);
	return (
		<Container style={{marginTop: 'calc(50vh - 128px)'}}>
            {cause}
        </Container>
	)
}