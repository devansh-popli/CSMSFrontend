import { privateAxios } from "./AxiosService"

export const saveServiceRequest=(serviceRequest)=>{
    return privateAxios.post("/api/service-requests",serviceRequest).then(res=>res.data)
}
export const generateInvoice=(serviceRequestId)=>{
    return privateAxios.get("/api/service-requests/"+serviceRequestId).then(res=>res.data)
}