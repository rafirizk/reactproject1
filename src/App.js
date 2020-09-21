import React, { useEffect, useState } from 'react';
import {Switch, Route} from 'react-router-dom';
import './App.css';
import Home   from './pages/Home'
import Admin  from './pages/Admin'
import Login  from './pages/Login';
import Register from './pages/register/Register'
import TripList from './pages/tripList/TripList'
import Cart from './pages/cart/Cart'
import {connect} from 'react-redux'
import {LoginFunc} from './redux/actions'
import Axios from 'axios';
import {API_URL} from './helper/API_URL'
import NotFound from './pages/NotFound'
import TripDetail from './pages/tripDetail/TripDetail'

function App(props) {
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    var id = localStorage.getItem('id')
    if (id) {
      Axios.get(`${API_URL}/users/${id}`)
      .then((res) => {
        Axios.get(`${API_URL}/carts`,{
          params:{
              userId:res.data.id,
              _expand:'product'
          }
        }).then((res1)=>{
            props.LoginFunc(res.data,res1.data)
        }).catch((err)=>{
            console.log(err)
        }).finally(()=>{
          setLoading(false)
        })
      })
      .catch((err) => {
        console.log(err)
      })
      .finally(() => {
        setLoading(false)
      })
    } else{
      setLoading(false)
    }
  }, [])

  if (loading) {
    return(
      <div>Loading</div>
    )
  }
  
  return (
    <div>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/manageAdmin" component={Admin}/>
        <Route path="/login" component={Login} />
        <Route path="/tripList" component={TripList} />
        <Route path="/trip/:id" component={TripDetail} />
        <Route path="/register" component={Register} />
        <Route path="/cart" component={Cart} />
        <Route path="*" component={NotFound} />
      </Switch>
    </div>
  );
}

const MapstatetoProps = ({Auth}) => {
  return {
    ...Auth
  }
}

export default connect(MapstatetoProps, {LoginFunc}) (App);
