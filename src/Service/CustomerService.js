import axios from "axios"
import { privateAxios } from "./AxiosService"

export const getCustomers=()=>{
    return privateAxios.get("/api/customers").then(res=>res.data)
}
export const getCustomersBySearch=(search)=>{
    return privateAxios.get("/api/customers/search/"+search).then(res=>res.data)
}
export const getCustomerById=(id)=>{
    return privateAxios.get("/api/customers/"+id).then(res=>res.data)
}
export const saveCustomer=(customer)=>{
    return privateAxios.post("/api/customers",customer).then(res=>res.data)
}