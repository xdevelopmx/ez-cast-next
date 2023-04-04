import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

type ConfirmationDialogProps = {
    title: string,
    content: JSX.Element | null,
    onOptionSelected: (confirmed: boolean) => void,
    opened: boolean
}

export default function ConfirmationDialog(props: ConfirmationDialogProps) {
    return (
        <div>
            <Dialog
                open={props.opened}
                onClose={() => props.onOptionSelected(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {props.title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {props.content}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => props.onOptionSelected(false)}>Cancelar</Button>
                    <Button onClick={() => props.onOptionSelected(true)} autoFocus>
                        Confirmar
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}