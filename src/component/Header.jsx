import React, { useState, useEffect } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import {MdFlightTakeoff} from 'react-icons/md'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { makeStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import { waitForElementToBeRemoved } from '@testing-library/react';
import {LogoutFunc} from '../redux/actions'

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

const NavigationBar = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScroll, setIsScroll] = useState(false)
  const [listener, setListener] = useState(null)
  const classes = useStyles();

  useEffect(() => {
      setListener(
          document.addEventListener("scroll", (e) => {
              let scrolled = document.scrollingElement.scrollTop
              if (scrolled >= 5) {
                setIsScroll(true)

              }else {
                setIsScroll(false)
              }
          })
      ) 
  }, [])

  useEffect(() => {
      document.removeEventListener("scroll", listener)
  },)

  const logoutClick = () => {
    localStorage.removeItem('id')
    props.LogoutFunc()
  }

  const countQtyProduct = () => {
    var result = 0
    props.cart.forEach(element => {
      return result += element.qty
    });
    return result
  }

  const toggle = () => setIsOpen(!isOpen);

  return (
    <>
      <div>
        <Navbar color={isScroll ? 'light' : ''} light expand="md">
          <Link to="/">
            <NavbarBrand><MdFlightTakeoff /> Travel-Kuy</NavbarBrand>
          </Link>
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            <Nav className="ml-auto" navbar>
              {
                props.isLogin ? 
                <>
                <NavItem>
                  <Link to="/cart">
                    <Badge badgeContent={countQtyProduct()} color="error" >
                      <ShoppingCartIcon color="disabled" />
                    </Badge>
                  </Link>
                  <Link to='/'>
                    <button className={isScroll ? "btn btn-outline-primary" : "btn btn-primary"} onClick={logoutClick} >Logout</button>
                  </Link>
                </NavItem>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    {props.username}
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem>
                      <Link to="/passwordChange">
                        Ganti Password
                      </Link>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
                </>
                :
                <NavItem className='mr-3'>
                  <Link to="/register">
                    <button className={isScroll ? "btn btn-outline-success mr-2" : "btn btn-success mr-2"}>Sign Up</button>
                  </Link>
                  <Link to="/login">
                    <button className={isScroll ? "btn btn-outline-primary" : "btn btn-primary"}>Login</button>
                  </Link>
                </NavItem>
              }
              {
                props.role === 'admin' ?
                <NavItem className='mr-3'>
                  <Link to="/manageAdmin">
                    <button className={isScroll ? "btn btn-outline-success ml-2" : "btn btn-success ml-2"}>Manage</button>
                  </Link>
                </NavItem>
                :
                null
              }
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    </>
  );
}

const MapstatetoProps = ({Auth}) => {
  return {
    ...Auth
  }
}


export default connect(MapstatetoProps, {LogoutFunc}) (NavigationBar);