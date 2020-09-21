import React, { Component, createRef } from 'react';
import Header from '../../component/Header'
import {connect} from 'react-redux'
import Axios from 'axios';
import {API_URL} from '../../helper/API_URL'
import {rupiahFormat} from '../../helper/Rupiah'
import NotFound from './../NotFound'
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import {AddcartAction} from '../../redux/actions'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';


class Cart extends Component {
    state = { 
        cart: [],
        cartFinal:[],
        isLoading: true,
        isOpen: false,
        paymentMethod: 0,
        ccNumber: createRef()
     }

    componentDidMount() {
        Axios.get(`${API_URL}/carts?userId=${this.props.id}`)
        .then((res) => {
            this.setState({cart:res.data})
            var deletearr=[]
            this.state.cart.forEach((val)=>{
                deletearr.push(Axios.delete(`${API_URL}/carts/${val.id}`))
            })
            Axios.all(deletearr)
            .then(()=>{
                var arr = this.state.cart
                let result = []
                arr.forEach(function (a) {
                    if (!this[a.productId]) {
                        this[a.productId] = { productId: a.productId, qty: 0, userId: a.userId, id: a.id};
                        result.push(this[a.productId]);
                    }
                    this[a.productId].qty += a.qty;
                }, Object.create(null));
                this.setState({cart:result})
                this.state.cart.forEach((val)=>{
                    result.push(Axios.post(`${API_URL}/carts`, val))
                })
                Axios.all(result)
                .then(() => {
                    Axios.get(`${API_URL}/carts?userId=${this.props.id}&_expand=product`)
                    .then((res3)=>{
                        this.setState({cart:res3.data, isLoading:false})
                        let finalTrip = res3.data.filter(val => val.product.endDate > new Date().getTime() )
                        this.setState({cartFinal:finalTrip})
                    }).catch((err)=>{
                        console.log(err)
                    })
                })
            }).catch((Err)=>{
                console.log(Err)
            })
        }).catch((err) => {
            console.log(err)
        })
    }
    
    renderCart = () => {
        return this.state.cart.map((val, index) => {
            if (val.product.endDate < new Date().getTime()){
               return(
               <TableRow key={val.id}>
                    <TableCell style={{color: '#808080'}}>{index+1}</TableCell>
                    <TableCell style={{color: '#808080'}}>{val.product.name}</TableCell>
                    <TableCell>
                        <div style={{maxWidth:'200px'}}>
                            <img width='100%' height='100%' src={val.product.pict} alt={val.product.name}/>
                        </div>
                    </TableCell>
                    <TableCell style={{color: '#808080'}}>{val.qty}</TableCell>
                    <TableCell style={{color: '#808080'}}>{rupiahFormat(val.product.price)}</TableCell>
                    <TableCell style={{color: '#808080'}}>{rupiahFormat(val.product.price*val.qty)}</TableCell>
                    <TableCell style={{color: '#808080'}}><button className="btn btn-danger" onClick={() => this.deleteCart(val.id)}>Del</button></TableCell>
                </TableRow>
               )
            }else{
                return(
                    <TableRow key={val.id}>
                        <TableCell>{index+1}</TableCell>
                        <TableCell>{val.product.name}</TableCell>
                        <TableCell>
                            <div style={{maxWidth:'200px'}}>
                                <img width='100%' height='100%' src={val.product.pict} alt={val.product.name}/>
                            </div>
                        </TableCell>
                        <TableCell><input type="number" value={val.qty} style={{maxWidth: '30%'}} onChange={(event) => this.changeQtyHandler(event, index)} /></TableCell>
                        <TableCell>{rupiahFormat(val.product.price)}</TableCell>
                        <TableCell>{rupiahFormat(val.product.price*val.qty)}</TableCell>
                        <TableCell><button className="btn btn-danger" onClick={() => this.deleteCart(val.id)}>Del</button></TableCell>
                    </TableRow>
                )
            }
            
        })
    }

    renderTotalPrice=()=>{
        var total = this.state.cartFinal.reduce((total,num)=>{
            return total+(num.product.price*num.qty)
        },0)
        return total
    }

    changeQtyHandler = (event, id) => {
        event.preventDefault()
        console.log(event.target.value)
        let qtyChange = this.state.cart
        qtyChange[id].qty = event.target.value
        this.setState({cart:qtyChange})
        // this.setState(prevState => ({
        //     cart: prevState.cart.map(
        //         el => el.id === id ? {...el, qty: event.target.value}: el
        //     )
        // }))
    }

    ccCheck = (input) => {
        var ccNum = input
        var visaRegEx = /^(?:4[0-9]{12}(?:[0-9]{3})?)$/;
        var mastercardRegEx = /^(?:5[1-5][0-9]{14})$/;
        var amexpRegEx = /^(?:3[47][0-9]{13})$/;
        var discovRegEx = /^(?:6(?:011|5[0-9][0-9])[0-9]{12})$/;
        var isValid = false;
        var ccType = ''

        if (visaRegEx.test(ccNum)) {
            isValid = true;
            ccType= 'Visa'
        } else if(mastercardRegEx.test(ccNum)) {
            isValid = true;
            ccType= 'Master Card'
        } else if(amexpRegEx.test(ccNum)) {
            isValid = true;
            ccType= 'American Express'
        } else if(discovRegEx.test(ccNum)) {
            isValid = true;
            ccType= 'Discover'
        }

        if(isValid) {
            alert("Your " + ccType + " number is Valid");
            this.onCheckOutClick()
            this.openDialog()
        } else {
            alert("Please provide a valid CC number!");
        }
    }

    openDialog = () => {
        this.setState({isOpen: !this.state.isOpen})
    }

    handleChange = (event) => {
        this.setState({paymentMethod: event.target.value});
    };
    
    onCheckOutClick=()=>{
        Axios.post(`${API_URL}/transactions`,{
            status:'WaitingPayment',
            checkoutDate:new Date().getTime(),
            userId:this.props.id,
            tanggalPembayaran:''
        }).then((res)=>{
            var arr=[]
            this.state.cartFinal.forEach((val)=>{
                arr.push(Axios.post(`${API_URL}/transactionsDetails`,{
                    transactionId:res.data.id,
                    productId:val.productId,
                    price: parseInt(val.product.price),
                    qty: parseInt(val.qty)
                }))
            })
            Axios.all(arr).then(()=>{
                var deletearr=[]
                this.state.cart.forEach((val)=>{
                    deletearr.push(Axios.delete(`${API_URL}/carts/${val.id}`))
                })
                Axios.all(deletearr)
                .then(()=>{
                    Axios.get(`${API_URL}/carts`,{
                        params:{
                            userId:this.props.id,
                            _expand:'product'
                        }
                    })
                    .then((res3)=>{
                        this.setState({cart: res3.data, cartFinal: res3.data})
                        this.props.AddcartAction(res3.data)
                    }).catch((err)=>{
                        console.log(err)
                    })
                }).catch((Err)=>{
                    console.log(Err)
                })
            }).catch((err)=>{
                console.log(err)
            })
        }).catch((err)=>{
            console.log(err)
        })
    }

    deleteCart = (index) => {
        Axios.delete(`${API_URL}/carts/${index}`)
        .then(() => {
            Axios.get(`${API_URL}/carts?userId=${this.props.id}&_expand=product`)
            .then((res) => {
                this.setState({cart:res.data})
                this.props.AddcartAction(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
        })
        .catch((err) => {
            console.log(err)
        })
    }

    render() { 
        if(this.state.isLoading){
            return <div>ABC</div>
        }
        console.log(this.state.cart)
        if(this.props.role === 'user'){
            return ( 
                <div>
                    <Header />
                    <div className=' pt-3' style={{paddingLeft:'10%',paddingRight:'10%'}}>
                        <Paper >
                            <TableContainer >
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>No.</TableCell>
                                            <TableCell style={{width:'200px'}}>Nama Trip</TableCell>
                                            <TableCell style={{width:'200px'}}>Gambar</TableCell>
                                            <TableCell>Jumlah</TableCell>
                                            <TableCell>Harga</TableCell>
                                            <TableCell>subtotal Harga</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.renderCart()}
                                    </TableBody>
                                    <TableFooter>
                                        <TableCell colSpan={4}></TableCell>
                                        <TableCell style={{fontWeight:'700',color:'black',fontSize:20}}>Subtotal Harga</TableCell>
                                        <TableCell style={{color:'black',fontSize:20}}>{rupiahFormat(this.renderTotalPrice())}</TableCell>
                                    </TableFooter>
                                </Table>
                            </TableContainer>
                            <button onClick={this.openDialog}  className='my-3' >
                                CheckOut
                            </button>
                        </Paper>
                        <Dialog open={this.state.isOpen} onClose={this.openDialog} aria-labelledby="form-dialog-title">
                            <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
                            <DialogContent>
                            <DialogContentText>
                                To subscribe to this website, please enter your email address here. We will send updates
                                occasionally.
                            </DialogContentText>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Pilih Pembayaran</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                defaultValue={1}
                                // value={this.state.paymentMethod}
                                onChange={this.handleChange}
                                style={{width: '100%'}}
                                >
                                <MenuItem value={1}>Kartu Kredit</MenuItem>
                                <MenuItem value={2}>Transfer</MenuItem>
                                </Select>
                            </FormControl>
                            {this.state.paymentMethod === 2 ?
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Upload Bukti Pembayaran"
                                type="file"
                                fullWidth
                            />:
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                label="Masukan Nomor Kartu"
                                type="number"
                                inputRef={this.state.ccNumber}
                                fullWidth
                            />}
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={this.openDialog} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={() => this.ccCheck(this.state.ccNumber.current.value)} color="primary">
                                Bayar
                            </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                </div>
             );
        }else{
            return(
                <NotFound />
            )
        }
    }
}
 
const Mapstatetoprops= ({Auth}) => {
    return {
        ...Auth
    }
}

export default connect(Mapstatetoprops,{AddcartAction}) (Cart);