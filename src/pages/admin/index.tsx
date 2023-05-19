import { Inbox, Logout, Mail, Movie, PhotoAlbum } from "@mui/icons-material";
import { CssBaseline, Box, AppBar, Toolbar, Typography, Drawer, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Container } from "@mui/material";
import { motion } from "framer-motion";
import { GetServerSideProps, NextPage } from "next";
import { getSession, signOut } from "next-auth/react";
import { useMemo, useState } from "react";
import { CatalogoProyectos } from "~/components/admin/catalogos/proyectos";
import { Banners } from "~/components/admin/contenido/Banners";
import { Alerts } from "~/components/layout/Alerts";
import Constants from "~/constants";
import { TipoUsuario } from "~/enums";

const AdminIndexPage: NextPage = () => {
    const [option_selected, setOptionSelected] = useState< {
        title: String,
        icon?: JSX.Element,
        key: string
    }>({title: '', key: ''});

    const content = useMemo(() => {
        switch (option_selected.key) {
            case 'banners': return <Banners/>;
            case 'proyectos': return <CatalogoProyectos/>;
        }
        return null;
    }, [option_selected]);

    return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${240}px)`, ml: `${240}px`, height: 76 }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Admin {(option_selected.key !== '') ? `- ${option_selected.title}` : ''} {option_selected.icon}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar sx={{backgroundColor: '#069CB1', height: 76}}>
          <motion.img src="/assets/img/logo_blanco.svg" className={`d-inline-block align-top w-100`} alt="" />
        </Toolbar>
        <Divider />
        <List>
          {[
            {
                title: 'Banners',
                icon: <PhotoAlbum/>,
                key: 'banners'
            },
            {
              title: 'Proyectos',
              icon: <Movie/>,
              key: 'proyectos'
            }
            ].map((item, index) => (
             <ListItem key={item.key} disablePadding>
              <ListItemButton onClick={() => setOptionSelected(item)}>
                <ListItemIcon>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => {
              void signOut({
                callbackUrl: '/admin/login'
              });
            }}>
              <ListItemIcon>
                  <Logout/>
              </ListItemIcon>
              <ListItemText primary={'Cerrar sesion'} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />
        <Container maxWidth="xl">
            {content}
        </Container>
      </Box>
      <Alerts/>
    </Box>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  if (session && session.user) {
      if (session.user.tipo_usuario === TipoUsuario.ADMIN) {
          return {
              props: {
                  user: session.user,
              }
          }
      }
      return {
          redirect: {
              destination: `/error?cause=${Constants.PAGE_ERRORS.UNAUTHORIZED_USER_ROLE}`,
              permanent: true
          }
      }
  }
  return {
      redirect: {
          destination: '/',
          permanent: true,
      },
  }
}

export default AdminIndexPage;