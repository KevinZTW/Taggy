import { Account } from '@/types/Account'
import request from '../utils/Request';

export const AccountService = () => ({
    getToken(email:string, password:string){
        return request<string>({
            url: `/api/token`,
            method: 'POST',
            body: {email: email, password: password},
        })
    },
    
    signup(name: string, email:string, password:string){
        return request<Account>({
            url: `/api/accounts`,
            method: 'POST',
            body: {name: name, email: email, password: password},
        })
    },
})