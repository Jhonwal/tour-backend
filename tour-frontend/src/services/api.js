import axios from 'axios';
import { useCookies } from 'react-cookie';

function useApi() {
    const [cookies] = useCookies(['XSRF-TOKEN']);

    // Create an instance of axios with default configurations
    const api = axios.create({
        baseURL: 'http://127.0.0.1:8000',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': cookies['XSRF-TOKEN'],
        },
        withCredentials: true,

    });

    return api;
}

export default useApi;
