# Progetto-Informatica

APP: https://app.albe0x.com/

API: https://api.albe0x.com/

Per avviare

docker-compose up

# Real time chat
## Appunti
- Non chiamate o input/output vocali
- Chat in real time
- Chat privata
- Post
- Login

## Strumenti utilizzati
- DB PostgreSQL
- React(con vite)
- Backend Node

## Ordine implementazione


-RESTFUL API
-DB TABLES




## API END POINTS:

- POST 		/login
- POST 		/logout
- GET 		/me

- GET 		/user
- GET 		/user/username
- POST		/user
- PUT		  /user/username
- DELETE	/user/username


- GET 		/post
- GET 		/post/:id_post
- POST		/post
- PUT		  /post/:id_post
- DELETE	/post/:id_post


- GET 		/message
- GET 		/message/:id_message
- POST		/message
- PUT		  /message/:id_message
- DELETE	/message/:id_message



# API NON DESCRITTE 


GET /message/conversation/:id_partner: 

GET /message/inbox: 

3. Logica del FEED
GET /post/user/:id_user
4. Ricerca e Social
GET /user/search?q=[]


