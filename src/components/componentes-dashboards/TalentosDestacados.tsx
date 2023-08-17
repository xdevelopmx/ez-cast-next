import React, { useMemo } from 'react'

import { motion } from 'framer-motion'
import { api } from '~/utils/api'
import { MContainer } from '../layout/MContainer';
import { Typography } from '@mui/material';
import { Carroucel } from '../shared/Carroucel';
import Image from 'next/image';

type Props = {
  slidesPerView?: number;
}

export const TalentosDestacados = ({ slidesPerView = 3 }: Props) => {
  const talentos = api.talentos.getAllTalentosDestacados.useQuery();

  console.log(talentos.data);

  const data = useMemo(() => {
    if (talentos.data) {
      return talentos.data.map(t => {
        const foto_perfil = t.media.filter(m => m.media.identificador.includes('foto-perfil'))[0];
        return {
          img_profile: (foto_perfil) ? foto_perfil.media.url : '/assets/img/no-image.png',
          talento: t
        }
      })
    }
    return [];
  }, [talentos.data]);

  return (
    <>
      <div className="col-md-6">
        <p className="h4 font-weight-bold" style={{ fontSize: '1.5rem' }}>Destacados</p>
        <div className="container_slider_destacados" style={{padding: '10px 20px'}}>
          <Carroucel slidesPerView={slidesPerView} >
            {data.map((d, i) => {
              return (
                <MContainer key={i} direction='vertical'
                  styles={{ padding: '14px', height: '300px' }}>
                  <div style={{ border: '2px solid #adadad', height: '100%' }}>
                    <div style={{
                      position: 'relative',
                      width: '100%',
                      height: 'calc( 100% - 50px )'
                    }}>
                      <Image fill src={d.img_profile} style={{objectFit: 'contain', backgroundColor: '#fff'}} alt="talento" />
                    </div>
                    <div className="cart_slider"
                      style={{ backgroundColor: 'white', height: '50px', overflow: 'hidden' }}>
                      <Typography style={{
                        paddingLeft: 8,
                        paddingRight: 8,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        height: '25px',
                        width: '100%',
                      }} variant={'subtitle2'} className="color_a">
                        {d.talento.nombre} {d.talento.apellido}
                      </Typography>
                      <MContainer direction='horizontal' justify='space-between' styles={{ alignItems: 'baseline', flexWrap: 'nowrap' }}>
                        <Typography fontSize={'0.8rem'} style={{ paddingLeft: 8, textOverflow: 'ellipsis' }}
                          variant={'body2'}>
                          {d.talento.info_basica?.union?.id_union === 99 ? d.talento.info_basica.union.descripcion : d.talento.info_basica?.union?.union.es}
                        </Typography>
                        {d.talento.info_basica?.estado_republica.es.length > 0?
                        <div style={{ paddingRight: 8, alignItems: 'baseline' }} className="d-lg-flex cart_slider_datos">
                          <p><motion.img src="/assets/img/iconos/cart_location_blue.svg" alt="icon" /> {d.talento.info_basica?.estado_republica.es}</p>
                        </div>
                        :
                        ''
                        }
                      </MContainer>
                    </div>
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
