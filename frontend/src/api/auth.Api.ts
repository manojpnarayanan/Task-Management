import api from '../api/auth';

export interface UserResponse {
    _id: string;
    name: string;
    email: string;
}


export const authService = {
    login:async (data:Record<string,string>):Promise<UserResponse>=>{
        const response=await api.post('auth/login',data);
        return response.data;
    },
    register:async (data:Record<string,string>):Promise<UserResponse>=>{
        const response=await api.post('auth/register',data)
        return response.data;
    },
    logout: async ():Promise<{message:string}>=>{
        const response=await api.post('auth/logout');
        return response.data;
    }
}