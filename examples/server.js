import axios from 'axios'

export const getStats = () => axios.get('/stats').then(({ data: res }) => res)
