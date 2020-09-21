import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextareaAutosize from '@material-ui/core/TextareaAutosize'

export default function ModalAdd() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Add
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
        <DialogContent>
            <DialogContentText>
            To subscribe to this website, please enter your email address here. We will send updates
            occasionally.
            </DialogContentText>
            <TextField
                autoFocus
                margin="dense"
                label="Nama Trip"
                fullWidth
                type='text'
            />
            <TextField
                margin="dense"
                label="Gambar Trip"
                fullWidth 
                type='text'
            />
            <TextField
                margin="dense"
                label="Tanggal Mulai"
                type="date"
                defaultValue="2017-05-24"
                fullWidth 
            />
            <TextField
                margin="dense"
                label="Tanggal Selesai"
                type="date"
                defaultValue="2017-05-24"
                fullWidth 
            />
            <TextField
                margin="dense"
                label="Harga"
                fullWidth 
                type='number'
            />
            <TextareaAutosize aria-label="minimum height" rowsMin={3} placeholder="Deskripsi" width='' />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

