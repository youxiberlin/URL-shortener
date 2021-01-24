# URL Shortener

**Requirement**　

- NodeJS newer than v12.14.1
- PostgresSQL
- Redis

### How to set up the application

1. Clone this repository locally

`git clone https://github.com/youxiberlin/URL-shortener.git`

2. Install the dependencies

`cd ./url-shortener` and then `yarn` or `npm i`

3. Set environment variables

| Variable     |           | Example, Memo|
| ------------- |:--------:| -----:|
| PORT | Optional      | Default value: 3000  |
| **PG_USER**  | **Required** |     |
| PG_HOST  | Optional      | Default value: localhost  |
| **PG_DB** | **Required**     |    |
| PG_PASS | Optional      | Default value: null  |
| PG_PORT | Optional      | Default value: 5432  |
| REDIS_HOST  | Optional      | Default value: localhost  |
| REDIS_PORT | Optional      | Default value: 6379  |
   

### How to run the application

1. Start local PostgresSQL and Redis server
2. Start the application with `yarn start` or `npm start`

### How to use the application

**1. To get a shortened URL for a certain URL**  
Please send a `POST` request to the endpoint `/shorturl`

Example with `httpie`
```
http POST localhost:3000/shorturl url=${target_url}
```
Please replace `${target_url}` with your target URL like this:
```
http POST localhost:3000/shorturl url=https://www.tier.app/de/tier-partners-with-fantasmo/
```

If the request succeeds, you get the shortened URL in the response like this:
```
{
    "result": "tier.app/ur_33RAX",
    "status": "Success!"
}
```

**2. To use the shortened URL**

Copy and paste the short ID on your browser. If the shortned URL is `tier.app/ur_33RAX` and you are running the application on `localhost:3000`, then please hit the URL: `localhost:3000/ur_33RAX`. Because the application is not yet deployed with `tier.app`.

The browser should redirect you to the original URL! 🚀

**3. To get the stats of the access**


Interested in how many access you've got to the shortened URL?
Then, send a `GET` request to the endpoint `/stats/access` like this:

```
http localhost:3000/stats/access
```

If the request was success, you should get the data like this:

```
{
    "data": {
        "MR2VqmDT": 1,
        "VeJtrA_h": 2,
        "sSjoSEvU": 3,
    },
    "status": "Success"
}
```
   
It showes how many access each shortned URL got so far.



----
If you have any questions, please drop me a line at sato.youxi@gmail.com ✉️

Yuki 