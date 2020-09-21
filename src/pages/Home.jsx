import React, { Component } from 'react'
import BGPicture from '../assets/backgroundHome.jpg'
import Navbar from '../component/Header'
import Axios from 'axios'
import {API_URL} from '../helper/API_URL'
import {Link} from 'react-router-dom'
import {
    Card, 
    CardImg,
    CardBody,
    CardTitle,
    CardSubtitle,
    CardText,
    Button
} from 'reactstrap'

const Background = {
    backgroundImage: 'url(' + BGPicture + ')',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    height: '100vh',
    width: '100%'
}

class Home extends Component {
    state = { 
        trip: [],
        isLoading: true
    }

    componentDidMount(){
        Axios.get(`${API_URL}/products`)
        .then((res) => {
            this.setState({trip:res.data, isLoading:false})
        })
        .catch((err) => {
            console.log(err)
        })
    }

    readMore = (words) => {
        const countWords = words.split(' ').filter((val)=> val !==' ').length
        const arrayWords = words.split(' ').map((val, index) => index < 25 ? val:'')
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
    }

    renderTrip = () => {
        let tripHome = [this.state.trip[1], this.state.trip[0]]
        return tripHome.map((val,index) => {
            return (
                <div className="col-md-6">
                    <Card style={{minHeight:'100%'}}>
                        <CardImg top width="100%" src={val.pict} alt={val.name} />
                        <CardBody>
                            <CardTitle>{val.name}</CardTitle>
                            <CardSubtitle>Deskripsi</CardSubtitle>
                            <CardText>{this.readMore(val.desc)}</CardText>
                            <Link to={"/trip/" + val.id}>
                                <Button>View</Button>
                            </Link>
                        </CardBody>
                    </Card>
                </div>
            )
        })
    }

    render() {
        if(this.state.isLoading){
            return <div>ABC</div>
        }else{
            return (
                <div>
                    <Navbar />
                    <div className='jumbotron' style={Background}>
                    </div>
                    <div className='container'>
                        <div className='row'>
                            {this.renderTrip()}
                        </div>
                    </div>
                    <div className="container d-flex justify-content-center">
                        <Link to="/tripList">
                            <Button color="primary" className="my-2">Lihat Semua</Button>
                        </Link>
                    </div>
                </div>
            )
        }

    }
}

export default Home