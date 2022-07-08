import {configureStore} from '@reduxjs/toolkit';
import userAuthReducer from './userAuthReducer'

 const store = configureStore({
    reducer:{
        userAuth:userAuthReducer
    }
});

export default store