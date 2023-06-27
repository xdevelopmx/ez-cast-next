import React, { useMemo, useState } from 'react'

import { motion } from 'framer-motion'
import { Box, Button, Grid, IconButton, Typography } from '@mui/material'
import { Circle, Close } from '@mui/icons-material'
import { api } from '~/utils/api'
import { getSession } from 'next-auth/react'
import { User } from 'next-auth'

export const Alertas = (props: {user: User | undefined}) => {
  const [show_alertas, setShowAlertas] = useState(false);

  const alertas = api.alertas.getByUser.useQuery({id_user: (props.user && props.user.id) ? parseInt(props.user.id) : 0, tipo_user: (props.user && props.user.tipo_usuario) ? props.user.tipo_usuario: ''});
  
  const alert_elements = useMemo(() => {
    if (alertas.data) {
      return alertas.data.map(a => <div dangerouslySetInnerHTML={{ __html: a.mensaje }} />)
    }
    return [];
  }, [alertas.data]);

  return (
    <>
    <div
				style={{ position: 'relative', width: '100%' }}>
				<motion.div
					style={{
            padding: 32,
            position: 'absolute',
						width: '50%',
            right: 0,
            maxHeight: '75vh',
						boxShadow: 'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
						top: -64,
						borderRadius: 4,
						zIndex: 99,
						backgroundColor: '#dff8fc',

					}}
					initial={{ opacity: 0, scale: 0 }}
					animate={(show_alertas) ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
					exit={{ opacity: 0, scale: 0 }}
					transition={{
						ease: "linear",
						duration: 0.4,
						opacity: { duration: 0.4 },
						scale: { duration: 0.4 }
					}}
				>
					<IconButton
						style={{
							position: 'absolute',
							right: 0,
							color: '#069cb1'
						}}
						aria-label="Cancelar edicion usuario"
						onClick={() => {
							setShowAlertas(show => !show)
						}}
					>
						<Close />
					</IconButton>
					<div className="d-flex justify-content-end btn_alerts_header">
            <div className="box_alert_header mr-4">
              <motion.img onClick={() => {setShowAlertas(show => !show)}} src="/assets/img/iconos/bell_blue.svg" alt="" />
              <span className="count_msn active">2</span>
            </div>
            <p className="font-weight-bold h4 mr-5 mb-0 color_a">Tus alertas</p>
          </div>
          <Box textAlign={'end'}>
            <Button>
              Ver todas
            </Button>
            <Button>
              Marcar todas como leidas
            </Button>
          </Box>
          <Grid container gap={2} justifyContent="center" maxHeight={'60vh'} overflow={'auto'}>
            {alert_elements.map((r, i) => {
              return <Grid key={i} item xs={12}>
                <Box sx={{
                  position: 'relative',
                  backgroundColor: '#4ab7c6'
                }}>
                  <Circle style={{ position: 'absolute', color: 'tomato', width: 16, height: 16, marginRight: 4, top: 'calc(50% - 8px)', left: 8 }} />
                  <div style={{marginLeft: 32}}>
                    {r}
                  </div>
                </Box>
              </Grid>

            })}
          </Grid>
        </motion.div>
      </div>
        <div className="pt-4 container_alerts_header">
            <div className="d-flex justify-content-end btn_alerts_header">
              <div className="box_alert_header mr-4">
                <motion.img onClick={() => {setShowAlertas(show => !show)}} src="/assets/img/iconos/bell_blue.svg" alt="" />
                <span className="count_msn active">2</span>
              </div>
              <p className="font-weight-bold h4 mr-5 mb-0 color_a">Tus alertas</p>
            </div>
        </div>
    </>
  )
}