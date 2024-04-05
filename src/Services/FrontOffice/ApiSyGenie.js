import axios from "axios";



export async function gemini(trans) {
  try {
    const res = await axios.post(
      `http://localhost:3000/gem/gemini`,
      {
        text : 'give me a response without any * or special caractere i want a simple text now answer this :' +trans 
      }
    );


    const rep = res.data.answer;
 // alert(rep)
 // console.log("nchalah timchi",rep)
    return rep
    }
 catch (error) {
    console.error("Error fetching data from the Gemini API:", error);
    return null; // Return null or handle the error appropriately
  }
}
