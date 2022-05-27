// ** Router Import
import Router from './router/Router'
import { isLogin } from './api/post'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { checkLogin } from './redux/authentication'
import axios from 'axios'
import { handleBasicTitleAlert } from './extension/basicalert'
const App = () => {

    const dispatch = useDispatch();
    const state = useSelector(state => state.auth);



    useEffect(() => {


        let token = localStorage.getItem('token')
        if (token) {
            dispatch(checkLogin(token))
        }
        //Axios Config
        axios.defaults.baseURL = 'https://api.egecanyildirim.com';

    }, [])

    useEffect(() => {
        if (state.isLogin === false) {
            handleBasicTitleAlert(state.message, state.status, state.title)
        }
        let access_token = localStorage.getItem('token')
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
        // axios.defaults.headers.common['authorization'] = ;

    })



    return <Router />


}
export default App
