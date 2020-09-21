import Axios from 'axios'
import {API_URL} from '../../helper/API_URL'

export const LoginFunc = (obj,cart) => {
    return {
        type: 'LOGIN',
        payload: obj,
        cart: cart
    }
}

export const AddcartAction=(cart)=>{
    return{
        type:'ADDCART',
        cart:cart
    }
}

export const LogoutFunc = () => {
    return {
        type: 'LOGOUT'
    }
}

export const LoginThunk=(username,password)=>{
    return (dispatch)=>{
        dispatch({type:'LOADING'})
        Axios.get(`${API_URL}/users`,{
            params:{
                username:username,
                password:password
            }
        }).then((res)=>{
            if(res.data.length){
                Axios.get(`${API_URL}/carts`,{
                    params:{
                        userId:res.data[0].id,
                        _expand:'product'
                    }
                }).then((res1)=>{
                    localStorage.setItem('id',res.data[0].id)
                    dispatch({type:'LOGIN',payload:res.data[0],cart:res1.data})
                }).catch((err)=>{
                    dispatch({type:'Error',payload:'servernya error bro'})
                })
            }else{
                dispatch({type:'Error',payload:'Username/Password Salah'})
            }
        }).catch((err)=>{
            dispatch({type:'Error',payload:'servernya error bro'})
        })
    }
}
// export const LoginThunk = (username,password) => {
//     return (dispatch) => {
//         Axios.get(`${API_URL}/users`,{
//             params:{
//                 username: username,
//                 password: password
//             }
//         }).then((res) => {
//             localStorage.setItem('id', res.data[0].id)
//             dispatch({type:'LOGIN',payload:res.data[0]})
//         }).catch((err) => {
//             console.log(err)
//         })
//     }
// }