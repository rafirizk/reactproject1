import React, { Component, createRef } from 'react';
import Header       from '../../component/Header'
import Axios        from 'axios'
import Swal         from 'sweetalert2'
import {API_URL}    from '../../helper/API_URL'
import {connect}    from 'react-redux'
import {Link}       from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import Modal        from '@material-ui/core/Modal';
import {AddcartAction} from '../../redux/actions'

function rand() {
    return Math.round(Math.random() * 20) - 10;
}
  
function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
}
  
const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
}));

class DetailTrip extends Component {
    state = {
        product: [],
        qty: createRef()
    }

    componentDidMount(){
        Axios.get(`${API_URL}/products/${this.props.match.params.id}`)
        .then((res) => {
            this.setState({product:res.data})
        })
        .catch((err) => {
            console.log(err)
        })
    }

    addTripToCart = () => {
        if (this.props.username === ''){
            return (
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Harap Login terlebih dahulu',
                    footer: '<a href="/login">Login</a>'
                  })
            )
        }else{
            Axios.post(`${API_URL}/carts`,{
                userId: this.props.id,
                productId: this.state.product.id,
                qty: parseInt(this.state.qty.current.value)
            }).then(()=>{
                Axios.get(`${API_URL}/carts`,{
                    params:{
                        userId:this.props.id,
                        _expand:'product'
                    }
                }).then((res)=>{
                    this.props.AddcartAction(res.data)
                    alert('berhasil masuk cart')
                }).catch((err)=>{
                    console.log(err)
                })
            })
        }
    }
    

    render() { 
        return (  
            <div>
                <Header />
                <div className="container">
                    <div style={{maxWidth:'100%'}}>
                        <img src={this.state.product.pict} alt={this.state.product.name} />
                    </div>
                    <div>
                        <p>Jumlah Tiket</p>
                        <input type="number" defaultValue="1" ref={this.state.qty} /><br/>
                        <button className="btn btn-primary" onClick={this.addTripToCart} >Add to Cart</button>
                    </div>
                </div>
            </div>
        );
    }
}
 
const Mapstatetoprops= ({Auth}) => {
    return {
        ...Auth
    }
}

export default connect(Mapstatetoprops,{AddcartAction}) (DetailTrip);