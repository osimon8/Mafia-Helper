import Cookies from 'js-cookie';

const startSession = (token) => {
    Cookies.set('token', token, {expires: 1});
}

const endSession = () => {
    Cookies.remove('token');
}

const getToken = () => {
    return Cookies.get('token');
}


export {startSession, endSession, getToken};