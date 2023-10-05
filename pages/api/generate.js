import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});
export default async function (req, res) {

  const animal = req.body.animal || '';
  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid animal",
      }
    });
    return;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages:[{role: "user", content: generatePrompt(animal)}],
      temperature: 0.6,
    });

    console.debug(completion);
    console.debug(completion.choices[0].message);


    res.status(200).json({ result: completion.choices[0].message.content });
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

function generatePrompt(animal) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `Посоветуй три супергеройских имени для животного.

  Животное: Кот
  Имена: Капитан Острый Коготь, агент Пушистик, Невероятный Кот
  Животное: Собака
  Имена: Защитник Рафф, Чудо-пес
  Животное: ${capitalizedAnimal}
  Имена:`;
}
