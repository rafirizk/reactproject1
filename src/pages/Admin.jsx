import React, {useState, useRef, useEffect} from 'react';
import Button           from '@material-ui/core/Button';
import TextField        from '@material-ui/core/TextField';
import Dialog           from '@material-ui/core/Dialog';
import DialogActions    from '@material-ui/core/DialogActions';
import DialogContent    from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextareaAutosize from '@material-ui/core/TextareaAutosize'
import Axios from 'axios'
import {API_URL} from '../helper/API_URL'
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Navbar from '../component/Header'
import {connect} from 'react-redux'
import NotFound from './NotFound'

const useStyles = makeStyles({
    root: {
      width: '100%',
    },
    container: {
      maxHeight: 440,
    },
});


const nowDate = () => {
    let d = new Date()
    let day = d.getDate()
    let month = d.getMonth()+1
    let year = d.getFullYear()
    let output = year + '-0' + month + '-' + day

    return output
}


const Admin = (props) => {
    const [open, setOpen] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [addForm, setAddForm] = useState({
        tripName: useRef(),
        tripPicture: useRef(),
        tripStartDate: useRef(),
        tripEndDate: useRef(),
        tripPrice: useRef(),
        tripDesc: useRef()
    })
    const [editForm, setEditForm] = useState({
        editTripName: useRef(),
        editTripPicture: useRef(),
        editTripStartDate: useRef(),
        editTripEndDate: useRef(),
        editTripPrice: useRef(),
        editTripDesc: useRef()
    })
    const [products, setProducts] = useState([]);
    const classes = useStyles();
    const [indexEdit, setIndexEdit] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Axios.get(`${API_URL}/products`)
        .then((res) => {
            setProducts(res.data)
            setLoading(!loading)
        })
        .catch((err) => {
            console.log(err)
        })
    },[])

    const readMore = (words => {
        const countWords = words.split(' ').filter((val)=> val !==' ').length
        const arrayWords = words.split(' ').map((val, index) => index < 20 ? val:'')
        if (countWords >10){
            const finalWords = arrayWords.join(' ')
            return (
                <>
                {finalWords}
                <span style={{color: 'grey'}}>Read More..</span>
                </>
            )
        }
        return words
    })
    
    const handleClick = () => {
        setOpen(!open);
    };

    const handleEditClick = (id) => {
        setIndexEdit(id)
        setOpenEdit(!openEdit)
    }

    const formatDate = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
    
        return [year, month, day].join('-');
    }

    const addNewData = () => {
        let name = addForm.tripName.current.value
        let pict = addForm.tripPicture.current.value
        let startDate = addForm.tripStartDate.current.value
        let endDate = addForm.tripEndDate.current.value
        let price = addForm.tripPrice.current.value
        let desc = addForm.tripDesc.current.value
        let obj = {
            name, 
            pict, 
            startDate: new Date(startDate).getTime() , 
            endDate: new Date(endDate).getTime(), 
            price, 
            desc
        }
        Axios.post(`${API_URL}/products`, obj)
        .then(() => {
            Axios.get(`${API_URL}/products`)
            .then((res) => {
                setProducts(res.data)
                handleClick()
            })
            .catch((err) => {
                console.log(err)
            })
        })
        .catch((err) => {
            console.log(err)
        })
    }

    const editHandler = (id) => {
        let name = editForm.editTripName.current.value
        let pict = editForm.editTripPicture.current.value
        let editStartDate = editForm.editTripStartDate.current.value
        let editEndDate = editForm.editTripEndDate.current.value
        let price = editForm.editTripPrice.current.value
        let desc = editForm.editTripDesc.current.value
        let obj = {
            name, 
            pict, 
            startDate: new Date(editStartDate).getTime() , 
            endDate: new Date(editEndDate).getTime(), 
            price, 
            desc
        }
        Axios.put(`${API_URL}/products/${id}`, obj)
        .then(() => {
            Axios.get(`${API_URL}/products`)
            .then((res) => {
                setProducts(res.data)
                setOpenEdit(!openEdit)
            })
            .catch((err) => {
                console.log(err)
            })
        })
        .catch((err) => {
            console.log(err)
        })
    }

    const rupiahFormat = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(number)
    
    }

    const deleteHandler = (index) => {
        Axios.delete(`${API_URL}/products/${index}`)
        .then(() => {
            Axios.get(`${API_URL}/products`)
            .then((res) => {
                setProducts(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
        })
        .catch((err) => {
            console.log(err)
        })
    }

    const renderData = () => {
        return products.map((val, index) => {
            return(
                <TableRow key={val.id}>
                    <TableCell>{index+1}</TableCell>
                    <TableCell>{val.name}</TableCell>
                    <TableCell>
                        <div style={{maxWidth:'100px'}}>
                            <img width='100%' height='100%' src={val.pict} alt={val.name} />
                        </div>
                    </TableCell>
                    <TableCell>{formatDate(val.startDate)}</TableCell>
                    <TableCell>{formatDate(val.endDate)}</TableCell>
                    <TableCell>{rupiahFormat(val.price)}</TableCell>
                    <TableCell>
                        <div style={{maxWidth:'400px'}}>
                            {readMore(val.desc)}
                        </div>
                    </TableCell>
                    <TableCell>
                        <Button variant="contained" onClick={() => handleEditClick(index)} >Edit</Button>
                        <Button variant="contained" color="secondary" className="my-2" onClick={() => deleteHandler(val.id)}>Del</Button>
                    </TableCell>
                </TableRow>
            )
        })
    }

    if (loading) {
        return <div>loading</div>
    }

    if (props.role === 'admin'){
        return (
            <div>
                <Navbar />
                <div className='mt-5'>
                    <div>
                        <Button variant="contained" color="primary" onClick={handleClick} className="m-3">
                            Add
                        </Button>
                        <Dialog open={open} onClose={handleClick} aria-labelledby="form-dialog-title">
                            <DialogTitle id="form-dialog-title">Add Trip</DialogTitle>
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
                                    inputRef={addForm.tripName}
                                />
                                <TextField
                                    margin="dense"
                                    label="Gambar Trip"
                                    fullWidth 
                                    type='text'
                                    inputRef={addForm.tripPicture}
                                />
                                <TextField
                                    margin="dense"
                                    label="Tanggal Mulai"
                                    type="date"
                                    defaultValue={nowDate()}
                                    fullWidth
                                    inputRef={addForm.tripStartDate}
                                />
                                <TextField
                                    margin="dense"
                                    label="Tanggal Selesai"
                                    type="date"
                                    defaultValue={nowDate()}
                                    fullWidth
                                    inputRef={addForm.tripEndDate}
                                />
                                <TextField
                                    margin="dense"
                                    label="Harga"
                                    fullWidth 
                                    type='number'
                                    inputRef={addForm.tripPrice}
                                />
                                <TextareaAutosize 
                                aria-label="minimum height" 
                                rowsMin={3} 
                                placeholder="Deskripsi" 
                                style={{width: '100%'}} 
                                className='mt-2' 
                                ref={addForm.tripDesc}
                                />
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={handleClick} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={addNewData} color="primary">
                                Submit
                            </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                    <Dialog open={openEdit} onClose={() => setOpenEdit(!openEdit)} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">Edit Trip</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                            To subscribe to this website, please enter your email address here. We will send updates
                            occasionally.
                            </DialogContentText>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Nama Trip"
                                defaultValue={products[indexEdit].name}
                                fullWidth
                                type='text'
                                inputRef={editForm.editTripName}
                            />
                            <TextField
                                margin="dense"
                                label="link Gambar"
                                defaultValue={products[indexEdit].pict}
                                fullWidth 
                                type='text'
                                inputRef={editForm.editTripPicture}
                            />
                            <TextField
                                margin="dense"
                                label="Tanggal Mulai"
                                type="date"
                                defaultValue={formatDate(products[indexEdit].startDate)}
                                fullWidth
                                inputRef={editForm.editTripStartDate}
                            />
                            <TextField
                                margin="dense"
                                label="Tanggal Selesai"
                                type="date"
                                defaultValue={formatDate(products[indexEdit].endDate)}
                                fullWidth
                                inputRef={editForm.editTripEndDate}
                            />
                            <TextField
                                margin="dense"
                                label="Harga"
                                fullWidth 
                                type='number'
                                inputRef={editForm.editTripPrice}
                                defaultValue={products[indexEdit].price}
                            />
                            <TextareaAutosize 
                            aria-label="minimum height" 
                            rowsMin={3} 
                            placeholder="Deskripsi" 
                            style={{width: '100%'}} 
                            className='mt-2' 
                            ref={editForm.editTripDesc}
                            defaultValue={products[indexEdit].desc}
                            />
                        </DialogContent>
                        <DialogActions>
                        <Button onClick={() => setOpenEdit(!openEdit)} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={() => editHandler(products[indexEdit].id)} color="primary">
                            Submit
                        </Button>
                        </DialogActions>
                    </Dialog>
                    <div>
                        <Paper className={classes.root}>
                            <TableContainer className={classes.container}>
                                <Table stickyHeader aria-label="sticky table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>No.</TableCell>
                                            <TableCell>Nama Trip</TableCell>
                                            <TableCell>Gambar</TableCell>
                                            <TableCell>Tanggal Mulai</TableCell>
                                            <TableCell>Tanggal Berakhir</TableCell>
                                            <TableCell>Harga</TableCell>
                                            <TableCell>Keterangan</TableCell>
                                            <TableCell>Aksi</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {renderData()}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </div>
                </div>
            </div>
        )
    }else{
        return(
            <NotFound />
        )
    }
}

const MapstatetoProps = ({Auth}) => {
    return{
        ...Auth
    }
}

export default connect(MapstatetoProps) (Admin)