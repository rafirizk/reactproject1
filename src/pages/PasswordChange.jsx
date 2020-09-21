import React, { Component, createRef } from 'react';
import {connect} from 'react-redux'
import Navbar from '../component/Header'
import {API_URL} from '../helper/API_URL'
import Axios from 'axios'


class PasswordChange extends Component {
    state = { 
        oldPassword: createRef(),
        newPassword: createRef()
     }

    componentDidMount() {
        Axios.get(`${API_URL}/users`)
        .then((res) => {
            this.setState({loginData:res.data})
        }).catch((err) => {
            console.log(err)
        })
    }
    
    submitChangePassword = () => {
        let oldPassword = this.state.oldPassword.current.value
        let newPassword = this.state.newPassword.current.value
        let obj = {username: this.props.username, password: newPassword, role: 'user'}
        let arrChar = []
        let letter = /[a-z]/g
        if (oldPassword === this.props.password){
            if (newPassword.length >= 6) {
                for (let i=0; i<newPassword.length; i++){
                    let character = newPassword.charAt(i)
                    if (!isNaN(character *1)) {
                        arrChar.push('number')
                    } else if (character.toLowerCase().match(letter)) {
                        arrChar.push('letter')
                    }
                };
                if (arrChar.includes('number') && arrChar.includes('letter')){
                    Axios.put(`${API_URL}/users/${this.props.id}`, obj)
                    .then(() => {
                    }).catch((err) => {
                        console.log(err)
                    })                    
                }else {
                    alert('Password harus mengandung Angka dan Huruf')
                }
            }else {
                alert('Password minimal 6 karakter')
            }
        }else{
            alert('Password salah!')
        }
    }
    
    render() {
        return ( 
            <div>
                <Navbar />
                <div className="d-flex justify-content-center align-items-center" style={{height:'80vh'}}>
                    <div className="py-4 px-4" style={{width: '30%', border: '1px solid black', display: 'flex', flexDirection: 'column'}} >
                        <h2 style={{textAlign: 'center', fontWeight: '600'}}>{this.props.username}</h2>
                        <input type="password" placeholder="Old Password" className="my-2 form-control" ref={this.state.oldPassword} />
                        <input type="password" placeholder="New Password" className="my-2 form-control" ref={this.state.newPassword} />
                        <button onClick={this.submitChangePassword} className="btn btn-primary my-2 m-auto w-50">Submit</button>
                    </div>
                </div>
            </div>
        );
    }
}

const MapstatetoProps = ({Auth}) => {
    return {
      ...Auth
    }
  }
  
 
export default connect(MapstatetoProps) (PasswordChange);