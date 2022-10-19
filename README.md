# NCB4 backend sample app

## Setup

- Create `.env` file in the root folder
- If ran with a ssl certificate, websocket url is `wss://domain.dev?api_key=pretty-secret-stuff`

## Content of .env file

```
API_KEY=pretty_secret_stuff
```

## Git workflows

- on push to main or dev, unit tests will be executed