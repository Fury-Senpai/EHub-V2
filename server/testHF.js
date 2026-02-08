const axios = require('axios');
require('dotenv').config();

const MODEL = "EleutherAI/gpt-neo-2.7B";


async function test() {
  try {
    const response = await axios.post(
      `https://https://huggingface.co/EleutherAI/gpt-neo-2.7B/`,
      { inputs: "Hello, how are you?" },
      { headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` }, timeout: 60000 }
    );

    console.log(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
}

test();
