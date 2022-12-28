import axios from "axios";

const phoneNoteUrl = "/api/persons"

const getPhonenote = ()=>{
    return axios.get(phoneNoteUrl)
}

const addPhonenote = (newPerson)=>{
    return axios.post(phoneNoteUrl, newPerson)
}

const deletePhonenote = (id)=>{
    return axios.delete(phoneNoteUrl+'/'+id)
}

// const updatePhonenote = (id, newPerson) =>{
//     return axios.put(phoneNoteUrl+'/'+id, newPerson)
// }


// const phoneServices = {getPhonenote, addPhonenote, deletePhonenote, updatePhonenote}
const phoneServices = {getPhonenote, addPhonenote, deletePhonenote}

export default phoneServices