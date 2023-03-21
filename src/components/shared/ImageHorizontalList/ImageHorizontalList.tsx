import MotionDiv from "~/components/layout/MotionDiv";
import { Archivo } from "~/server/api/root";
import Image from 'next/image';
import classes from './ImageHorizontalList.module.css';
import { MContainer } from "../../layout/MContainer";
import { Typography } from "@mui/material";

interface Props {
    images: Archivo[],
    onImageRemove: (index: number) => void
}

export default function ImageHorizontalList(props: Props) {
    return (
        <MotionDiv style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}} show={true} animation='left-to-right'>       
            <>
                <MotionDiv show={props.images.length > 0} animation="left-to-right">
                    <>
                        {props.images.map((f, i) => {
                            if (i === 0) {
                                return (
                                    <span key={i} style={{width: 128, height: 200}}>
                                        <p className={classes['text-element-selected']}>Foto de perfil</p>
                                        <Image style={{margin: 8}} className={classes['border-element-selected']} alt={`Imagen ${f.name}`} key={f.name} width={128} height={156} src={f.base64}/>
                                    </span>
                                 )
                            }
                            return  (
                                <Image style={{margin: 8}} className={classes['border-element']} alt={`Imagen ${f.name}`} key={f.name} width={128} height={156} src={f.base64}/>
                            )
                            
                        })}
                    </>

                </MotionDiv>
                

                {props.images.length === 0 &&
                    <MotionDiv show={props.images.length === 0} animation="left-to-right">
                        <MContainer direction='vertical'>
                            <Image style={{margin: 8}}  alt={`No imagens`} width={256} height={200} src={'/assets/img/no-image.png'}/>
                            <Typography fontSize={18}>
                                Agrega al menos una foto de perfil
                            </Typography>
                        </MContainer>

                        
                    </MotionDiv>
                }
            </>
        </MotionDiv>
    )
}