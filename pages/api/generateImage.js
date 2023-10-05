import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});
export default async function (req, res) {

  const image = req.body.image || '';
  if (image.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid image",
      }
    });
    return;
  }

  try {
    const data = await openai.images.generate({
      prompt: image,
      n: 1,
      size: "256x256",
    });

    console.debug(data);

    res.status(200).json({ result: data.data[0].url });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}
