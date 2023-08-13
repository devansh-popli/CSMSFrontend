import axios from "axios"
import { privateAxios } from "./AxiosService"

export const saveVehicle=(vehicleData)=>{
    return privateAxios.post("/api/vehicles",vehicleData).then(res=>res.data)
}
export const getVehicleByCustomer=(id)=>{
    return privateAxios.get("/api/vehicles/"+id).then(res=>res.data)
}
