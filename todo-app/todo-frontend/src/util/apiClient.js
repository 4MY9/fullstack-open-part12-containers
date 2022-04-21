import axios from 'axios'
// eslint-disable-next-line no-unused-vars
const dotenv = require('dotenv').config();

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
})

export default apiClient