import axios from "./axios";
import conferenceDummyData from "../data/conferenceDummyData";

const USE_BACKEND = false;
const conferenceApi = {
    async getAll(filters){
        if(USE_BACKEND){
            const response = await axios.get("/conference", {params:filters});
            return response.data;
        }
        return conferenceDummyData;
    },

    async upload(file){
        if(USE_BACKEND){
            const formData = new FormData();
            formData.append("file",file);
            const response = await axios.post("/conference/upload", formData);
            return response.data;
        }
        return {};
    },

    async update(id, data){
        if(USE_BACKEND){
            return axios.put(`/conference/${id}`, data);
        }
    },
    async delete(id){
        if(USE_BACKEND){
            return axios.delete(`/conference/${id}`);
        }
    },
    async export(filters){
        
    }
}