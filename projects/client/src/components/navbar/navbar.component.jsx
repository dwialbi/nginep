import { useState } from "react"
import {
  BiCart,
  BiSearch,
  BiX,
  BiMenu,
  BiBookReader,
  BiChevronDown,
} from "react-icons/bi"
import { useDispatch, useSelector } from "react-redux"
import { Link, Navigate, useNavigate } from "react-router-dom"
import { logout, login } from "../../redux/features/authSlice"
// import { axiosInstance } from "../../api/index"
import { Box, useDisclosure, useToast } from "@chakra-ui/react"
import "./navbar.styles.css"
import ReAuth from "../reAuthUser/reAuth.component"

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [open, setOpen] = useState(false)
  const [openOption, setOpenOption] = useState(false)
  const navigate = useNavigate()

  const toast = useToast()

  const authSelector = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const logoutBtnHandler = () => {
    localStorage.removeItem("auth_token")
    dispatch(logout())
    navigate("/")
  }

  return (
    <div className="navbar-body">
      <header className="navbar-header">
        <Link to="/" class="logo">
          <BiBookReader />
          ILOVE 69
        </Link>
        <div class="group">
          <ul
            className="navbar-ul"
            class={`${!open ? "closed-navigation" : "navigation"}`}
          >
            <li className="navbar-li">
              <Link className="login-transform" to="/">
                Home
              </Link>
            </li>
            <li className="navbar-li">
              <Link className="login-transform" to="/property-form">
                Property
              </Link>
            </li>
            {authSelector.loginWith === "email" ? (
              <li className="navbar-li">
                <Link
                  className="login-transform"
                  // to="/reauth"
                  onClick={onOpen}
                >
                  ReAuth
                </Link>
              </li>
            ) : null}

            <li className="navbar-li">
              {authSelector.id ? (
                <div className="dropdown-navbar">
                  <span
                    className="current-user"
                    onClick={() => {
                      setOpenOption(!openOption)
                    }}
                  >
                    {authSelector.id} <BiChevronDown />
                  </span>
                  <div
                    className={`${!openOption ? "option-navbar" : "option-open"}
                    `}
                  >
                    <li className="navbar-li">
                      {" "}
                      <Link
                        className="login-transform"
                        onClick={logoutBtnHandler}
                      >
                        Logout
                      </Link>{" "}
                    </li>
                    <li className="navbar-li">
                      <Link className="login-transform" to="/">
                        <BiCart /> Chart
                      </Link>
                    </li>
                  </div>
                </div>
              ) : (
                <Link className="login-transform" to="/login">
                  Login
                </Link>
              )}
            </li>
          </ul>
          {/* <div class="search">
            <span class="icon">
              <BiSearch
                class="searchBtn"
                onClick={() => {
                  setShowSearch(!showShearch)
                }}
              />
              <BiX
                class={`${showShearch ? "closeBtn" : "closeActive"} `}
                onClick={() => {
                  setOpen(!open)
                }}
              />
            </span>
          </div> */}
          <BiMenu
            class="menuToggle"
            onClick={() => {
              setOpen(!open)
            }}
          />
        </div>
        {/* <div class={`${showShearch ? "showSearch" : "searchBox"} `}>
          <input type="text" placeholder="Search here" />
        </div> */}
      </header>
      <ReAuth isOpen={isOpen} onClose={onClose} />
    </div>
  )
}

export default Navbar
