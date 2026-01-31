import  axios  from "axios";
import Cookies from "cookie-universal";
export const baseUrl = 'https://goba.sunmedagency.com'
const cookie = Cookies()
const token = cookie.get('token')
//token);
export const Axios = axios.create({
  baseURL:'https://crm.sunmedagency.com/api',
  headers: {
    Authorization: 'Bearer ' + token
  }
})
