const {
  dialogflow,
  Suggestions,
  Image,
  BasicCard
} = require('actions-on-google');
const functions = require('firebase-functions');
const axios = require('axios');
const app = dialogflow({debug: true});
app.intent('Default Welcome Intent', (conv) => {
  conv.ask('Welcome to a fun adventure where you can explore all about pokemons. What do you want to try first');
  conv.ask(new Suggestions('Pokemon images', 'Random Pokemon'));
});

app.intent('Pokemon images', (conv) => {
  if(!conv.screen) {
    conv.ask('Sorry, try this action on a phone.');
    conv.close('Goodbye. Have a good day!!');
  }
  else {
    conv.ask('Tell me name of a pokemon.');
  }
});
app.intent('Pokemon images - custom', (conv, {pokemon}) => {
  return axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
  .then((response) => {
    const imgUrl = response.data.sprites.front_default;
    conv.ask(`Here is an image of ${pokemon}`);
    conv.ask(new BasicCard({
      title: pokemon,
      image: new Image({
        url: imgUrl,
        alt: pokemon
      })
    }));
    conv.ask('What do you want to try next');
    conv.ask(new Suggestions('Pokemon images', 'Random Pokemon'));
    return;
  })
  .catch((error) => {
    conv.ask('Unable to fetch image');
    conv.ask('What do you want to do next');
    conv.ask(new Suggestions('Pokemon images', 'Random Pokemon'));
  });
});

app.intent('Random Pokemon', (conv) => {
  if(!conv.screen) {
    conv.ask('Sorry, try this action on a phone.');
    conv.close('Goodbye. Have a good day!!');
  }
  else {
    return axios.get('https://raw.githubusercontent.com/Biuni/PokemonGO-Pokedex/master/pokedex.json')
    .then((response) => {
      const pokemon = response.data.pokemon[Math.floor(Math.random() * response.data.pokemon.length)];
      conv.ask('Your random pokemon is:');
      conv.ask(new BasicCard({
        title: pokemon.name,
        image: new Image({
          url: pokemon.img,
          alt: pokemon.name
        })
      }));
      conv.ask('What do you want to do next');
      conv.ask(new Suggestions('Pokemon images', 'Random Pokemon'));
      return;
    })
    .catch((error) => {
      conv.ask('Unable to fetch image');
    conv.ask('What do you want to do next');
    conv.ask(new Suggestions('Pokemon images', 'Random Pokemon'));
    });
  }
});
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);

