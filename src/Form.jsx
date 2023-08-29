import React from 'react'
import { useState, useEffect } from 'react'
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import config from './config.json'
const auth= config.Authorization
const pic= config.image
const Form = () => { 
  const [image_data, set_image] =useState("");
  const [text_data,set_text]= useState("");
  const notify = () => toast("Upload a photo first!");

  

  const [data_to_send_to_backend,set_data_backend]=useState({
    image: "",
    text:""
  });

    const handleImage=(e)=>{
        set_image(e.target.files[0]);          
    }
    const handleText=(e)=>{
        set_text(e.target.value);    
    }

    
    const handleSubmit=(e)=>{
        e.preventDefault(); 
        e.preventDefault();
      console.log(image_data)
      if (image_data==""){        
        {notify()};
        return;
      }
      console.log(image_data);
      //get the data as a blob
      const blob= new Blob([image_data],{type:image_data.type})

      //open file reader to access the binary data and to convert blob to base64string
      const reader= new FileReader();

      //implement the onfinished read callback
      //where:convert blob to base64 string
      //where:do a fetch to send the data to Lambda for s3 write

      reader.onloadend=()=>{

        set_data_backend((previous_object)=>{
          return {...previous_object,
            image:reader.result,
            text:text_data};
          });
        
      }

      //do the readoperation
      reader.readAsDataURL(blob)
      
    }
    useEffect(()=>{
          
      console.log(data_to_send_to_backend);
      fetch("https://1ne5t0gxdk.execute-api.ap-south-1.amazonaws.com/V1/company-table-update",{
          method: "PUT",
          headers: {
              "Content-Type": "application/json",
              "Authorization": auth
            },
          body: JSON.stringify(data_to_send_to_backend)
      }).then(response=>console.log(response.status)||response).then(response=>response.json()).then(data=>console.log(data));  
    },[data_to_send_to_backend.text,data_to_send_to_backend.image]);
    
  return (
    <div>
        <form onSubmit={handleSubmit}>
            <div>
            <label htmlFor='photo_element'>Company Icon:</label>
            <input id="photo_element" name="photo" type="file" accept='.png,.jpg' onChange={handleImage}></input>
            
            <ToastContainer />
            </div>
            <div>
            <label htmlFor='data_element'>Company data:</label>
            <input id="data_element" name="data" type="text" onChange={handleText} ></input> 
            </div>
            <p> 
            <input id="submit_field" type='submit' value="send"/> 
            </p>      
        </form>
          <img src= {`data:image/png;base64,${pic}`} /> 
    </div>
  )
}

export default Form

