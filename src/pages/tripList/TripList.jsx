import React, { Component } from 'react';
import Header from '../../component/Header'
import Axios from 'axios'
import {
    Breadcrumb,
    BreadcrumbItem,
    Card,
    CardImg
} from 'reactstrap'
import {Link} from 'react-router-dom'
import {API_URL} from '../../helper/API_URL'

class TripList extends Component {
    state = { 
        products: []
    }

    componentDidMount(){
        Axios.get(`${API_URL}/products`)
        .then((res) => {
            let finalTrip = res.data.filter(val => val.endDate > new Date().getTime() )
            this.setState({products:finalTrip})
        })
        .catch((err) => {
            console.log(err)
        })
    }

    renderCard = () => {
        return this.state.products.map((val,index) => {
            return (
                <div className="col-md-3">
                    <Link to={"/trip/" + val.id}>
                        <Card>
                            <CardImg top width="100%" src={val.pict} alt={val.name} />
                        </Card>
                    </Link>
                </div>
            )
        })
    }

    render() {
        return(
            <>
                <Header />
                <div className="container">
                    <Breadcrumb tag="nav" listTag="div">
                        <BreadcrumbItem tag="a"><Link to="/">Home</Link></BreadcrumbItem>
                        <BreadcrumbItem active tag="span">Trip</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="row">
                        {this.renderCard()}
                    </div>
                </div>
            </>
        )
    }
}

export default TripList