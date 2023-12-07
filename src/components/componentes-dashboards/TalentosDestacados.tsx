import React, { useMemo } from 'react'

import { motion } from 'framer-motion'
import { api } from '~/utils/api'
import { MContainer } from '../layout/MContainer';
import { Typography } from '@mui/material';
import { Carroucel } from '../shared/Carroucel';
import Image from 'next/image';
import useLang from "~/hooks/useLang";
import AppContext from "~/context/app";
import { useContext } from "react";

type Props = {
  slidesPerView?: number;
}

export const TalentosDestacados = ({ slidesPerView = 3 }: Props) => {
  const talentos = api.talentos.getAllTalentosDestacados.useQuery();

  console.log(talentos.data);
  const ctx = useContext(AppContext);
  const textos = useLang(ctx.lang);
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
      <div className="col-md-6" style={{
        paddingLeft: '30px'
      }}>
        <p className="h4 font-weight-bold" style={{ fontSize: '1.3rem' }}>{textos["destacados"]?? ""}</p>
        <div className="container_slider_destacados" style={{padding: '10px 20px'}}>
          <Carroucel slidesPerView={slidesPerView} >
            {data.map((d, i) => {
              return (
                <MContainer key={i} direction='vertical' styles={{ margin: '14px', height: '205px', background: '#fff' }}>
                  <div style={{ border: '2px solid #adadad', height: '100%' }}>
                    <div style={{
                      position: 'relative',
                      height: 'calc( 100% - 64px )',
                      marginLeft: 8,
                      marginTop: 8,
                      marginRight: 8
                    }}>
                      <Image fill src={d.img_profile.length === 0 ? '/assets/img/no-image.png' : d.img_profile} style={{objectFit: 'contain', backgroundColor: '#fff'}} alt="talento" />
                    </div>
                    <div className="" style={{ backgroundColor: 'white', margin: '-10px 0 0 0', height: '60px', zIndex: '99', position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <MContainer direction='vertical' justify='space-between' styles={{ alignItems: 'baseline', flexWrap: 'nowrap', position: 'relative' }}>
                        <Typography style={{
                          paddingLeft: 8,
                          paddingRight: 8,
                          paddingTop: 8,
                          wordWrap: 'break-word',
                          width: '100%',
                          fontSize: '12px'
                        }} variant={'body1'} className="color_a">
                          {d.talento.nombre} {d.talento.apellido}
                        </Typography>
                          <Typography fontSize={'0.7rem'} style={{ paddingLeft: 8, textOverflow: 'ellipsis' }}
                            variant={'body2'}>
                            {d.talento.info_basica?.union?.id_union === 99 ? d.talento.info_basica.union.descripcion : d.talento.info_basica?.union?.union.es}
                          </Typography>
                          {d.talento.info_basica?.estado_republica.es && d.talento.info_basica?.estado_republica.es.length > 0?
                          <div style={{ paddingLeft: 8, alignItems: 'baseline' }} className="d-lg-flex cart_slider_datos">
                            <p style={{fontSize: '0.7rem', margin: 0}}><motion.img src="/assets/img/iconos/cart_location_blue.svg" alt="icon" /> {d.talento.info_basica?.estado_republica.es}</p>
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
