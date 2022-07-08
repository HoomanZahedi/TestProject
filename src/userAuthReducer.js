import {createSlice} from '@reduxjs/toolkit';
const initialState ={
    isAuth:false
}

const authSlice = createSlice({
    name:'userAuth',
    initialState,
    reducers:{
        userLogedIn(state){
            state.isAuth = true;
        }
    },
})
export default authSlice.reducer;
export const {userLogedIn} = authSlice.actions; 