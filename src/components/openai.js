import { Configuration, OpenAIApi } from "openai";

const API_KEY = "xx-xxxxxxxxxxxxxx";

// openai declaration and configuration
const openai = new OpenAIApi(new Configuration({
    apiKey: API_KEY,
}));

export async function sendMessageToOpenAI(message) {
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: message,
        temperature: 0,
        max_tokens: 3000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
    })

    return response.data.choices[0].text;
}