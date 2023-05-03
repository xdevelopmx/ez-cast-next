import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import React, { type Dispatch, type SetStateAction, type FC } from 'react'

interface Props {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const ModalLocacion: FC<Props> = ({ isOpen, setIsOpen }) => {
    return (
        <Dialog
            open={isOpen}
            onClose={() => setIsOpen(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setIsOpen(false)}>Cancelar</Button>
                <Button onClick={() => console.log('')} autoFocus>
                    Confirmar
                </Button>
            </DialogActions>
        </Dialog>
    )
}
