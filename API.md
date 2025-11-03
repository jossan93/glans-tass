# User API

Base URL `https://glans-and-tass.onrender.com/api`

Alla `me`-endpåionts kräver en JWT-token i headern:

## **1. Register - POST /users/register**



**Request:**
Skapar en ny användare.
```
curl -X POST "https://glans-and-tass.onrender.com/api/users/register" \
     -H "Content-Type: application/json" \
     -d '{
           "name": "Alice",
           "email": "alice@example.com",
           "password": "hemligt123"
         }'
```

**Respone 201 (Succes)**
```
{
"name": "Alice",
"email": "alice@example.com",
"password": "<hashed-password>",
"role": "user",
"\_id": "<user-id>"
}
```
**Response 400 (email finns redan)**


```
 { "error": "E-postadressen används redan" }
````

### **Logga in – POST /users/login**

```
curl -X POST "https://glans-and-tass.onrender.com/api/users/login" \
     -H "Content-Type: application/json" \
     -d '{
           "email": "alice@example.com",
           "password": "hemligt123"
         }'

```

**Respone 200 (Succes)**

```
{
  "message": "inloggning lyckades",
  "token": "<JWT-token>",
  "user": {
    "name": "Alice",
    "email": "alice@example.com",
    "role": "user"
  }
```

**Respone 401 (fel email/lösenord)**

```
{ "error": "fel epost eller lösenord" }

```
### **Hämta egen profil – GET /users/me**
```

curl -X GET "https://glans-and-tass.onrender.com/api/users/me" \
     -H "Authorization: Bearer <JWT-token>"

```

**Respone (200 Succes)**

```
{
  "_id": "<user-id>",
  "name": "Alice",
  "email": "alice@example.com",
  "role": "user"
}

```

**Respone 401(Ingen token/ogiltig token)**

```
{ "error": "Unauthorized" }

```

**Respone 404 (Användare finns inte)**

```
{ "error": "användare hittas inte" }

```
## **2. Service Endpoints**
GET /services \
Hämtar alla tjänster.
```
curl -X GET "https://glans-and-tass.onrender.com/api/services"

```
**Exempel med search-query**
```
curl -X GET "https://glans-and-tass.onrender.com/api/services?search=hund"
```

**Response 200**
```
[
  {
    "_id": "<service-id>",
    "name": "Hundbad liten",
    "description": "Bad, schamponering, fön och borstning för liten hund.",
    "price": 500,
    "duration": 45,
    "animalType": "hund"
  }
]

```
**Response 500 (fel vid hämtning)**
```
{ "error": "kunde inte hämta tjänster" }
```
**GET /services/:id – Hämta tjänst med ID**
```
curl -X GET "https://glans-and-tass.onrender.com/api/services/<service-id>"
```
**Response 200**
```
{
  "_id": "<service-id>",
  "name": "Hundbad liten",
  "description": "Bad, schamponering, fön och borstning för liten hund.",
  "price": 500,
  "duration": 45,
  "animalType": "hund"
}
```
**Response 404 (tjänst hittades inte)**
```
{ "message": "tjänst hittades inte" }
```
**Response 500 (fel vid hämtning)**
```
{ "message": "fel vid hämtning av tjänst" }
```
**POST /services – Skapa ny tjänst (admin)**
```
curl -X POST "https://glans-and-tass.onrender.com/api/services" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <JWT-token>" \
     -d '{
           "name": "Hundbad liten",
           "description": "Bad, schamponering, fön och borstning för liten hund.",
           "price": 500,
           "duration": 45,
           "animalType": "hund"
         }'

```
**Response 201 (Success)**


```
{
  "message": "tjänst skapad",
  "service": {
    "_id": "<service-id>",
    "name": "Hundbad liten",
    "description": "Bad, schamponering, fön och borstning för liten hund.",
    "price": 500,
    "duration": 45,
    "animalType": "hund"
  }
}
```
**Response 500 (fel vid skapande)**
```
{ "error": "kunde inte skapa tjänst" }
```

```
```

```
```

```

```

```
```

```

```

```
```

```
```

```
```

```
```

```
```

```
```
```

```
```

```
```

```
```

```


