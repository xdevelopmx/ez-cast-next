import React, { useMemo } from 'react'

import { motion } from 'framer-motion'
import { api } from '~/utils/api'
import { MContainer } from '../layout/MContainer';
import { Typography } from '@mui/material';
import { Carroucel } from '../shared/Carroucel';

export const TalentosDestacados = () => {
  const talentos = api.cazatalentos.getTalentosDestacadosByCazatalento.useQuery(undefined, {
    refetchOnWindowFocus: false
  });

  const data = useMemo(() => {
    if (talentos.data) {
      return talentos.data.map(t => {
        const foto_perfil = t.talento.media.filter(m => m.media.identificador.includes('foto-perfil'))[0];
        return {
          img_profile: (foto_perfil) ? foto_perfil.media.url : '/assets/img/no-image.png',
          talento: t.talento
        }
      })
    }
    return [];
  }, [talentos.data]);

  return (
    <>
        <div className="mt-2 col-md-6">
            <p className="h4 font-weight-bold">Destacados</p>
            <div className="container_slider_destacados">
              <Carroucel slidesPerView={3}>
                {data.map((d, i) => {
                    return (
                      <MContainer key={i} direction='vertical' styles={{paddingLeft: 32, paddingTop: 16, paddingBottom: 16}}>
                        <motion.img width={190} height={200} src={d.img_profile} alt="talento" />
                        <div className="cart_slider" style={{backgroundColor: 'white'}}>
                          <Typography style={{paddingLeft: 8}} variant={'subtitle2'} className="color_a">{d.talento.nombre} {d.talento.apellido}</Typography>
                          <MContainer direction='horizontal' justify='space-between' styles={{alignItems: 'baseline'}}>
                            <Typography fontSize={'0.8rem'} style={{paddingLeft: 8}} variant={'body2'}>{d.talento.info_basica?.union?.id_union === 99 ? d.talento.info_basica.union.descripcion : d.talento.info_basica?.union?.union.es}</Typography>
                            <div style={{paddingRight: 8, alignItems: 'baseline'}} className="d-lg-flex cart_slider_datos">
                              <motion.img src="/assets/img/iconos/cart_location_blue.svg" alt="icon" />
                              <p>{d.talento.info_basica?.estado_republica.es}</p>
                            </div>
                          </MContainer>
                        </div>
                      </MContainer>
                      
                    )
                  })}
              </Carroucel>
            </div>
          </div>
    </>
  )
}
