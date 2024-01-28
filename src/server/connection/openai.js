import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv"
dotenv.config();

const openaiAPIKey = process.env.OPENAI_API_Key

// If the API key has not been set in the .env file we must close out the backend
if (!openaiAPIKey){
    // Log the reason for the backend to close out 
    console.error('OPENAI_API_key is not set')
    // This closes the back end if the API key is not set
    process.exit(1)
}

// We set up the config that sets up the openai client (allows us acess)
const config = new Configuration({
    // We need to pass in the api key
    apiKey: openaiAPIKey
})

// This is creating a new instance of the client that connects to the Open AI api
const openai = new OpenAIApi(config)

export default openai

// This is how we configure the client in our node servers