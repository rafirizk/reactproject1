import React, { Component, createRef } from 'react';
import Header from '../../component/Header'
import {connect} from 'react-redux'
import Axios from 'axios';
import {API_URL} from '../../helper/API_URL'
import {rupiahFormat} from '../../helper/Rupiah'
import NotFound from '../NotFound'
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
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


class History extends Component {
    state = { 
        history: [],
        historyRender: [],
        historyDetail: [],
        isLoading: true,
        isLoading2: true,
        isOpen: false,
     }

    componentDidMount() {
        Axios.get(`${API_URL}/transactionsdetails?userId=${this.props.id}&_expand=transaction`)
        .then((res) => {
            this.setState({history:res.data})
            var arr = this.state.history
            let result = []
            arr.forEach(function (a) {
                if (!this[a.transactionId]) {
                    this[a.transactionId] = { transactionId: a.transactionId, transaction: a.transaction};
                    result.push(this[a.transactionId]);
                }
            }, Object.create(null))
            this.setState({historyRender: result, isLoading:false})
            Axios.get(`${API_URL}/transactionsdetails?userId=${this.props.id}&_expand=product`)
            .then((res1) => {
                this.setState({history:res1.data})
            }).catch((err) => {
            console.log(err)
        })
        }).catch((err) => {
            console.log(err)
        })
    }

    formatDate = (date) => {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;

        return date === '' ? 'Waiting for Confirmation': [year, month, day].join('-');
    }
    
    historyDetail = (id) => {
        let filteredHistory = this.state.history.filter( val => val.transactionId == id)
        this.setState({historyDetail: filteredHistory})
        this.openDialog()
    }
    
    renderCart = () => {
        return this.state.historyRender.map((val, index) => {
                return(
                    <TableRow key={val.id}>
                        <TableCell>{index+1}</TableCell>
                        <TableCell>{val.transaction.metodePembayaran}</TableCell>
                        <TableCell>{this.formatDate(val.transaction.tanggalPembayaran)}</TableCell>
                        <TableCell><button className="btn btn-primary" onClick={() => this.historyDetail(val.transactionId)}>Details</button></TableCell>
                    </TableRow>
                )
        })
    }

    renderTotalPrice=()=>{
        var total = this.state.historyDetail.reduce((total,num)=>{
            return total+(num.product.price*num.qty)
        },0)
        return total
    }
    
    renderHistoryDetail = () => {
        if(this.state.isOpen) {
            return this.state.historyDetail.map((val, index) => {
                return (
                    <TableRow key={val.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{val.product.name}</TableCell>
                        <TableCell>
                            <div style={{maxWidth:'100px'}}>
                                <img width='100%' height='100%' src={val.product.pict} alt={val.product.name}/>
                            </div>
                        </TableCell>
                        <TableCell>{val.product.qty}</TableCell>
                        <TableCell>{val.product.price}</TableCell>
                        <TableCell>{val.product.price*val.qty}</TableCell>
                    </TableRow>
                )
            })
        }   
    }
    
    openDialog = () => {
        this.setState({isOpen: !this.state.isOpen})
    }

    render() { 
        if(this.state.isLoading){
            return <div>ABC</div>
        }
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
                                            <TableCell>Metode Pembayaran</TableCell>
                                            <TableCell>Tanggal Pembayaran</TableCell>
                                            <TableCell>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.renderCart()}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                        <Dialog open={this.state.isOpen} onClose={this.openDialog} aria-labelledby="form-dialog-title">
                            <DialogTitle id="form-dialog-title">Details</DialogTitle>
                            <DialogContent>
                                <TableContainer >
                                    <Table stickyHeader>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>No.</TableCell>
                                                <TableCell>Nama Product</TableCell>
                                                <TableCell>Gambar</TableCell>
                                                <TableCell>qty</TableCell>
                                                <TableCell>Harga</TableCell>
                                                <TableCell>SubTotal</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {this.renderHistoryDetail()}
                                        </TableBody>
                                        <TableFooter>
                                            <TableCell colSpan={4}></TableCell>
                                            <TableCell style={{fontWeight:'700',color:'black',fontSize:15}}>Subtotal Harga</TableCell>
                                            <TableCell style={{color:'black',fontSize:15}}>{rupiahFormat(this.renderTotalPrice())}</TableCell>
                                        </TableFooter>
                                    </Table>
                                </TableContainer>
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={this.openDialog} color="primary">
                                Ok
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

export default connect(Mapstatetoprops) (History);