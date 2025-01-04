import {createSlice} from '@reduxjs/toolkit';
// import { updateUser } from '../../../../server/controllers/userController';


const initialState ={
    currentUser :null,
    loading :false,
    error: false,
}


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers:{
        signInStart :(state)=>{
            state.loading = true;
            state.error =null;
        },
        signInSuccess : (state, action )=>{
            state.currentUser = action.payload;
            state.loading =false;
            state.error =false;
        },
        signInFailure :(state, action)=>{
            state.loading =false;
            state.error =action.payload;
        },
        updateUserStart:(state)=>{
            state.loading = true;
            state.error =null;
        },
        updateUserSuccess : (state, action)=>{
            state.currentUser =action.payload;
            state.loading =false;
            state.error =false;
        },
        updateUserFailure: (state, action)=>{
            state.loading = false;
            state.error = action.payload;
        },
        signoutSuccess:(state)=>{
            state.currentUser = null;
            state.error =null;
            state.loading = false;
        },
    }
})


export const {signInStart , signInSuccess, signInFailure ,updateUserFailure, updateUserStart, updateUserSuccess , signoutSuccess } =userSlice.actions;

export default userSlice.reducer;