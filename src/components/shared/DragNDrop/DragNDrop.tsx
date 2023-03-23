import React, { useEffect, useRef, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import Image from 'next/image';
import { Alert, Button, Chip } from "@mui/material";
import classes from './DragNDrop.module.css';
import MotionDiv from "../../layout/MotionDiv";
import { Archivo } from "~/server/api/root";

const fileTypes = ["JPG", "PNG", "GIF", "PDF"];

interface Props {
    id: string,
    multiple_files?: boolean,
    files: Archivo[],
    label?: string,
    tooltip?: string,
    filetypes: string[],
    max_files?: number,
    hide_selected?: boolean,
    assign_selected_files_height?: boolean,
    onChange: (files: File[]) => void,
    show_download_url?: string
}

function DragNDrop(props: Props) {
    const [files, setFiles] = useState<Map<string, File>>(new Map());
    const [error, setError] = useState<{type: 'MAX_FILES_REACHED', message: string} | null>(null);
    const hide_error_time_ref = useRef<ReturnType<typeof setTimeout> | null>(null);
    useEffect(() => {
        if (hide_error_time_ref.current) {
            clearTimeout(hide_error_time_ref.current);
        }
        hide_error_time_ref.current = setTimeout(() => {
            setError(null);
        }, 2500);
	}, [error]);


    useEffect(() => {
        files.clear();
        props.files.forEach(f => {
            console.log(f);
            files.set(`${f.file.name}-${f.file.size}-${f.file.type}`, f.file);
        })
        setFiles(new Map(files));
    }, [props.files]);

    const handleChange = (selected_files: File[]) => {
        console.log(selected_files)
        const max_files = (props.max_files) ? props.max_files : 1;
        const current_files_size = files.size + selected_files.length;
        if (current_files_size <= max_files) {
            setError(null);
            Object.entries(selected_files).forEach(f => {
                files.set(`${f[1].name}-${f[1].size}-${f[1].type}`, f[1]);

                setFiles(new Map(files));
            })
            props.onChange(Array.from(files.values()));
        } else {
            setError({type: 'MAX_FILES_REACHED', message: `El maximo de archivos permitido es ${max_files}`});
        }
        // reiniciamos el input de archivos ya que lo estamos manejando con estado y se quita para permitir el caso donde el usuario elimine un archivo y quiera
        // volver a seleccionarlo

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const child = document.querySelectorAll(`.${props.id}`)[0]?.children[0];
        if (child) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            child.value = null;
        }
        
    };
    const handleRemove = (id: string) => {
        files.delete(id);
        if (error && error.type === 'MAX_FILES_REACHED') {
            if (files.size <= ((props.max_files) ? props.max_files : 1)) {
                setError(null);
            }
        }
        setFiles(new Map(files));
    }
    return (
        <MotionDiv style={{display: 'flex', flexDirection: 'column', maxWidth: 300}} show={true} animation="fade">
            <>
                {props.show_download_url &&
                    <Button size='small' className='font-weight-bold color_a' onClick={() => {
                        window.open(props.show_download_url)
                    }} variant="text">Descargar Archivo</Button>
                }
                <FileUploader classes={`root ${props.id}`} multiple handleChange={handleChange} name="file" types={props.filetypes} >
                    <div className="form-group">
                        <MotionDiv show={error != null} animation="fade">
                            <Alert 
                                className={classes['alert']} 
                                icon={false} 
                                variant='filled' 
                                color='error'>{(error) ? error.message : ''}
                            </Alert>
                        </MotionDiv>
                        <div className="d-flex mb-2 align-items-center">
                            {props.label &&
                                <>
                                    <Image width={18} height={18} src="/assets/img/iconos/ico_pdf_blue.svg" alt="icono" />
                                    <p className="ml-2 mb-0">{props.label}</p>
                                </>
                            }
                            {props.tooltip &&
                                <div style={{marginLeft: 8}} className="contToolTip blue_tootip mt-0" data-toggle="tooltip" data-html="true" data-placement="bottom" title={props.tooltip}>?</div> 
                            }
                        </div>
                        <div className="btn_talent_upload">
                            <div className="box_btn_upload">
                                <p className="mb-1">{`Acepta ${props.filetypes.join(', ')}`}</p>
                                <div className="btn btn-intro"><Image width={18} height={18} src="/assets/img/iconos/cruz_blue.svg" alt="icono" className="mr-2" /> Subir Archivo(s)
                                </div>
                                <p className="mb-1 txt_arrastrar">{`Arrastrar archivo(s) al recuadro ${(props.max_files) ? '(Hasta ' + props.max_files.toString() + ' archivos)' : ''}`}</p>
                            </div>
                        </div>
                    </div>
                </FileUploader>
                <div style={(!props.hide_selected && props.assign_selected_files_height) ? {height: (props.max_files) ? (props.max_files * 24) : 24} : {}}>
                    {!props.hide_selected && files.size > 0 && Array.from(files).map((value: [string, File]) => {
                        return <Chip style={{margin: 4, color: '#4ab7c6'}} size="small" key={value[1].name} label={value[1].name} variant="outlined" onDelete={() => {handleRemove(`${value[1].name}-${value[1].size}-${value[1].type}`)}} /> 
                    })}
                </div>
            </>
        </MotionDiv>
    );
}

export default DragNDrop;