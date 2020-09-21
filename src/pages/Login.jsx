import React, { Component, createRef } from 'react';
import Axios from 'axios'
import {API_URL} from '../helper/API_URL'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'
import {LoginFunc, LoginThunk} from './../redux/actions/'
import Navbar from '../component/Header'
import { Alert } from '@material-ui/lab';


class Login extends Component {
    state = {
        username: createRef(),
        password: createRef(),
        // inputBlank: false
    }

    
    submitLogin = () => {
        const {username,password} = this.state
        let inputUsername =  username.current.value
        let inputPassword = password.current.value
        this.props.LoginThunk(inputUsername,inputPassword)
        // if(!inputPassword || !inputUsername){
        //     this.setState({inputBlank: true})
        // }else {
        //     this.props.LoginThunk(inputUsername,inputPassword)
        // }
        // Axios.get(`${API_URL}/users?username=${inputUsername}&password=${inputPassword}`)
        // .then((res) => {
        //     if (res.data.length) {
        //         this.props.LoginFunc(res.data[0])
        //         localStorage.setItem('id',res.data[0].id) 
        //     }else{
        //         console.log('error')
        //     }
        // })
        // .catch((err) => {
        //     console.log(err)
        // })
    }



    render() {

        if (this.props.Auth.isLogin) {
            return <Redirect to="/" />
        }
        
        return (
            <div>
                <Navbar />
                <div className="d-flex justify-content-center align-items-center" style={{height:'80vh'}}>
                    <div className="py-4 px-4" style={{width: '30%', border: '1px solid black', display: 'flex', flexDirection: 'column'}} >
                        <h2 style={{textAlign: 'center', fontWeight: '600'}}>Login</h2>
                        <input type="text" placeholder="Username" className="my-2 form-control" ref={this.state.username} />
                        <input type="password" placeholder="Password" className="my-2 form-control" ref={this.state.password} />
                        {
                            this.props.Auth.error?
                            <Alert severity="error" className="mb-2">{this.props.Auth.error}</Alert>
                            // : this.state.inputBlank?
                            // <Alert severity="error">Username/Password tidak boleh kosong!</Alert>
                            :
                            null
                        }
                        <button onClick={this.submitLogin} className="btn btn-primary my-2 m-auto w-50">Submit</button>
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

export default connect(Mapstatetoprops, {LoginFunc, LoginThunk})(Login)