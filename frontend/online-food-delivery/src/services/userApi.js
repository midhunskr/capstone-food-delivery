import axios from "axios";


export const userLogin = async(data)=>{
    try {
        const response = await axios({
            url: 'http://localhost:3000/api/v1/user/login',
            method: 'POST',
            data,
            withCredentials: true
        })
        
        return response?.data;
        console.log(response);
        
    } catch (error) {
        console.log(error);
        
    }
}

export const userCheck = async () => {


}