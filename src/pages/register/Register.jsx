import React, { Component, createRef } from 'react';
import Axios from 'axios'
import {API_URL} from '../../helper/API_URL'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {LoginFunc, LoginThunk} from '../../redux/actions/'
import Navbar from '../../component/Header'
import { Alert } from '@material-ui/lab';

class Register extends Component {
    state = {
        loginData: [],
        username: createRef(),
        password: createRef(),
        alreadyRegistered: false,
        inputBlank: false
    }

    componentDidMount() {
        Axios.get(`${API_URL}/users`)
        .then((res) => {
            this.setState({loginData:res.data})
        }).catch((err) => {
            console.log(err)
        })
    }
    
    submitRegister = () => {
        const {username,password} = this.state
        let inputUsername =  username.current.value
        let inputPassword = password.current.value
        let obj = {username: inputUsername, password: inputPassword, role: 'user'}
        var inputRegister = this.state.loginData.filter((val)=> val.username == inputUsername)
        let arrChar = []
        let letter = /[a-z]/g
        if (!inputPassword || !inputUsername){
            this.setState({inputBlank: true, alreadyRegistered: false})
        }else if(inputRegister.length > 0){
            this.setState({alreadyRegistered: true, inputBlank: false})
        } else if (!inputRegister.length && inputPassword){
            if (inputPassword.length >= 6) {
                for (let i=0; i<inputPassword.length; i++){
                    let character = inputPassword.charAt(i)
                    if (!isNaN(character *1)) {
                        arrChar.push('number')
                    } else if (character.toLowerCase().match(letter)) {
                        arrChar.push('letter')
                    }
                };
                if (arrChar.includes('number') && arrChar.includes('letter')){
                    Axios.post(`${API_URL}/users`, obj)
                    .then(() => {
                        this.props.LoginThunk(inputUsername,inputPassword)
                    }).catch((err) => {
                        console.log(err)
                    })                    
                }else {
                    alert('Password harus mengandung Angka dan Huruf')
                }
            }else {
                alert('Password minimal 6 karakter')
            }
        }
    }



    render() {

        if (this.props.Auth.isLogin) {
            return <Redirect to="/" />
        }
        return (
            <div>
                <Navbar />
                <div className="d-flex justify-content-center align-items-center text-center" style={{height:'80vh'}}>
                    <div className="py-4 px-4" style={{width: '30%', border: '1px solid black', display: 'flex', flexDirection: 'column'}} >
                        <h2 style={{textAlign: 'center', fontWeight: '600'}}>Register</h2>
                        <input type="text" placeholder="Username" className="my-2 form-control" ref={this.state.username} />
                        <input type="password" placeholder="Password" className="my-2 form-control" ref={this.state.password} />
                        {
                            this.state.alreadyRegistered ?
                            <Alert severity="error" className="mb-2">Username sudah terpakai</Alert>
                            : this.state.inputBlank ?
                            <Alert severity="error" className="mb-2">Username/Password tidak boleh kosong!</Alert>:
                            null
                        }                        
                        <button onClick={this.submitRegister} className="btn btn-primary my-2 w-50 m-auto">Submit</button>
                    </div>
                </div>
            </div>
            )
    }
}

const Mapstatetoprops= (state) => {
    return {
        Auth: state.Auth
    }
}

export default connect(Mapstatetoprops, {LoginFunc, LoginThunk})(Register)