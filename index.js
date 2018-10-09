const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const axios = require('axios');
const cors = require('@koa/cors');

var router = new Router();

let agenciesData;

const API_KEY = process.env.API_KEY;

router.get('/health', (ctx, next) => {
  ctx.status = 200;
  ctx.body = '';
  return next();
});

router.get('/', async (ctx, next) => {
  const zenikaAgencies = [
    { name: 'Paris', lat: '48.8790132', lon: '2.3284880999999586' },
    { name: 'Lyon', lat: '45.76216030000001', lon: '4.862302499999942' },
    { name: 'Lille', lat: '45.6531445', lon: '3.080016999999998' },
    { name: 'Nantes', lat: '47.20737159999999', lon: '-1.555804500000022' },
    { name: 'Rennes', lat: '48.1149512', lon: '-1.6735092000000122' },
    { name: 'Bordeaux', lat: '44.8766633', lon: '-0.5799973000000591' },
    { name: 'Grenoble', lat: '45.1908938', lon: '5.713198299999931' },
    { name: 'Singapour', lat: '1.2780362', lon: '103.84973250000007' },
    { name: 'Montréal', lat: '45.50205700000001', lon: '-73.569345' },
  ];

  if (!agenciesData) {
    const agencies = await Promise.all(
      zenikaAgencies.map((zenikaAgencie) => {
        return axios.get(
          `https://api.darksky.net/forecast/${API_KEY}/${zenikaAgencie.lat},${zenikaAgencie.lon}`,
        );
      }),
    )
      .then((weatherDatas) => {
        return zenikaAgencies.map((zenikaAgencie, i) => {
          return {
            ...zenikaAgencie,
            weather: weatherDatas[i].data,
          };
        });
      })
      .catch(console.error.bind(console));

    agenciesData = agencies;
    ctx.body = agencies;
  } else {
    ctx.body = agenciesData;
  }

  return next();
});

app.use(cors());
app.use(router.routes()).use(router.allowedMethods());

app.listen(8080);
