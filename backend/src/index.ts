require("dotenv").config();
import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
 

interface ChatRequestBody {
    prompt: string;
}

interface Choice {
    message: {
      content: string
    }
  }
  
  interface ApiResponse { 
    choices: Choice[]
  }

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;


async function chatCompletions(prompt: string): Promise<string> {
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                model: "deepseek/deepseek-r1-distill-llama-70b:free",
                messages: [{ role : 'user', content: prompt}],
                stream: false,
            }),
        });
        if(!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = (await response.json()) as ApiResponse;
        const content =  data.choices[0]?.message?.content ?? "No response received";
        console.log(content);
        return content;
    } catch(error) {
        console.log("Error fetching response: ", error);
        return "Error generating response.";
    }
    }

    app.post("/chat", async (req:any, res:any) => {
        try {
          const { prompt } = req.body;
          if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
          }
      
          const response = await chatCompletions(prompt);
          return res.json({ response }); // Explicitly return the response
        } catch (error) {
          console.error("Error in /chat route:", error);
          return res.status(500).json({ error: "Internal Server Error" });
        }
      });
      
      
      // Start the server properly
      app.listen(3000, () => console.log("Server running on port 3000"));
    

