import { useState } from "react"
import axios from "axios";

export function Signin() {
    const [ prompt, setPrompt ] = useState<string>("");
    const [ responsetext , setResponseText ] = useState<string>("");
   

    const handlePrompt = async (prompt: string) => {
       try {
        const response = await axios.post("http://localhost:3000/chat", {
            prompt
          });
          console.log("Response: ", response.data);
       }catch(error) {
        console.log("Error fetching response: ", error);
       }
    };

    return (
       <div>
        <label>Prompt</label>
        <input 
        type="text"
        placeholder="prompt"
        onChange={(e) => setPrompt(e.target.value)}
        />

       <button onClick={() => handlePrompt(prompt)}>Give me a Prompt</button>

       
        { responsetext && (
            <div>
            <h3>Response:</h3>
            <p>{responsetext}</p>
            </div>
        )}
       
       </div>
    );

} 