# API-dokumentation

## Innehållsförteckning

1. [User API](#1-user-api)
2. [Service API](#2-service-endpoints)
3. [Booking API](#3-booking-endpoints)
4. [Admin API](#4-admin-endpoints)

Base URL `https://glans-and-tass.onrender.com/api`

## 1. User

### POST /users/register

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
```

### POST /users/login

Logga in

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

### GET /users/me

Hämta egen profil

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

### GET /services \

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

### GET /services/:id

Hämta tjänst med ID

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

### POST /services

Skapa ny tjänst (admin)

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

## 3. Booking Endpoints

### GET /bookings/available

Hämta lediga tider

```
curl -X GET "https://glans-and-tass.onrender.com/api/bookings/available?serviceId=<service-id>&date=2025-11-10" \
     -H "Authorization: Bearer <JWT-token>"
```

**Response 200**

```
{
  "availableSlots": [
    "10:00",
    "10:15",
    "10:30",
    "10:45",
    "11:00"
  ]
}
```

**Response 400 (saknar date eller serviceId)**

```
{ "message": "saknar date eller serviceId" }
```

**Response 404 (service hittades inte)**

```
{ "message": "service hittades inte" }
```

**Response 500 (serverfel)**

```
{ "message": "kunde inte hämta tillgänliga tider" }
```

### POST /bookings/

Skapa ny bokning

```
curl -X POST "https://glans-and-tass.onrender.com/api/bookings" \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <JWT-token>" \
     -d '{
           "service": "<service-id>",
           "date": "2025-11-10T10:00:00Z",
           "notes": "Liten hund, extra omsorg"
         }'
```

**Response 201 (Success)**

```
{
  "message": "bokning skapad",
  "booking": {
    "_id": "<booking-id>",
    "user": "<user-id>",
    "service": "<service-id>",
    "date": "2025-11-10T10:00:00Z",
    "notes": "Liten hund, extra omsorg",
    "status": "pending"
  }
}
```

**Response 400 (saknar serviceId eller date)**

```
{ "error": "saknar serviceid eller date" }
```

**Response 401 (Ej inloggad)**

```
{ "error": "Ej inloggad" }
```

**Response 404 (tjänsten hittades inte)**

```
{ "error": "tjänsten hittades inte" }
```

**Response 500 (serverfel)**

```
{ "error": "kunde inte skapa bokning" }
```

### GET /bookings/

Hämta användarens bokningar

```
curl -X GET "https://glans-and-tass.onrender.com/api/bookings" \
     -H "Authorization: Bearer <JWT-token>"
```

**Response 200**

```
[
  {
    "_id": "<booking-id>",
    "user": "<user-id>",
    "service": {
      "_id": "<service-id>",
      "name": "Hundbad liten",
      "price": 500,
      "duration": 45
    },
    "date": "2025-11-10T10:00:00Z",
    "notes": "Liten hund, extra omsorg",
    "status": "pending"
  }
]
```

**Response 500 (fel vid hämtning)**

```
{ "error": "kunde inte hämta bokningar" }
```

### DELETE /bookings/:id

Ta bort bokning

```
curl -X DELETE "https://glans-and-tass.onrender.com/api/bookings/<booking-id>" \
     -H "Authorization: Bearer <JWT-token>"
```

**Response 200 (Success)**

```
{ "message": "bokning borttagen" }
```

**Response 401 (Ej inloggad)**

```
{ "error": "Ej inloggad" }
```

**Response 404 (bokningen hittades inte**)

```
{ "error": "bokningen hittades inte" }
```

**Response 500 (serverfel)**

```
{ "error": "kunde inte ta bort bokning" }
```

## 4. Admin Endpoints

Alla endpoints kräver:

Inloggning (Authorization: Bearer <JWT-token>)

Att användaren har rollen admin

Base URL:
https://glans-and-tass.onrender.com/api/admin

### GET /users

Hämta alla användare

```
curl -X GET "https://glans-and-tass.onrender.com/api/admin/users" \
     -H "Authorization: Bearer <JWT-token>"
```

**Response 200 (Success)**

```
[
  {
    "_id": "6746f8d1a9328a7a5bfa7b2d",
    "name": "Alice",
    "email": "alice@example.com",
    "role": "user"
  }
]
```

**Response 500 (serverfel)**

```
{ "error": "kunde inte hämta användare" }
```

### POST /users

Skapa ny användare (som admin)

```
curl -X POST "https://glans-and-tass.onrender.com/api/admin/users" \
     -H "Authorization: Bearer <JWT-token>" \
     -H "Content-Type: application/json" \
     -d '{
           "name": "Charlie",
           "email": "charlie@example.com",
           "password": "hemligt123",
           "role": "user"
         }'
```

**Response 201 (skapad)**

```
{
  "message": "Användare Charlie skapades",
  "user": {
    "_id": "67470041c3bca2bb6a138be2",
    "name": "Charlie",
    "email": "charlie@example.com",
    "role": "user"
  }
}
```

**Response 400 (saknas fält eller epost används)**

```
{ "error": "namn, epost och lösenord krävs" }
```

**Response 400 (epost används redan)**

```
{ "error": "E-post används redan" }
```

**Response 500 (serverfel)**

```
{ "error": "kunde inte skapa användare" }
```

### PUT /make-admin/:id

Gör användare till admin

```
curl -X PUT "https://glans-and-tass.onrender.com/api/admin/make-admin/<user-id>" \
     -H "Authorization: Bearer <JWT-token>"
```

**Response 200 (Success)**

```
{
  "message": "Charlie är nu admin",
  "user": {
    "_id": "67470041c3bca2bb6a138be2",
    "name": "Charlie",
    "email": "charlie@example.com",
    "role": "admin"
  }
}
```

**Response 400 (redan admin)**

```
{ "error": "Charlie är redan admin" }
```

**Response 404 (användare hittas inte)**

```
{ "error": "Användare hittas inte" }
```

**Response 500 (serverfel)**

```
{ "error": "kunde inte uppdatera användarroll" }
```

### PUT /remove-admin/:id

Ta bort admin-roll

```
curl -X PUT "https://glans-and-tass.onrender.com/api/admin/remove-admin/<user-id>" \
     -H "Authorization: Bearer <JWT-token>"
```

**Response 200 (Success)**

```
{
  "message": "Charlie är inte längre admin",
  "user": {
    "_id": "67470041c3bca2bb6a138be2",
    "name": "Charlie",
    "email": "charlie@example.com",
    "role": "user"
  }
}
```

**Response 400 (redan vanlig användare)**

```
{ "error": "användaren är redan user" }
```

**Response 404 (användare hittas inte)**

```
{ "error": "användare hittas inte" }
```

**Response 500 (serverfel)**

```
{ "error": "kunde inte uppdatera användarroll" }
```

### DELETE /delete-user/:id

Ta bort användare

```
curl -X DELETE "https://glans-and-tass.onrender.com/api/admin/delete-user/<user-id>" \
     -H "Authorization: Bearer <JWT-token>"
```

**Response 200 (Success)**

```
{ "message": "användare Charlie har raderats" }
```

**Response 400 (försöker ta bort sig själv)**

```
{ "error": "du kan inte ta bort ditt eget konto" }
```

**Response 404 (användare hittas inte)**

```
{ "error": "användare hittas inte" }
```

**Response 500 (serverfel)**

```
{ "error": "kunde inte radera användare" }
```

### GET /bookings

Hämta alla bokningar

```
curl -X GET "https://glans-and-tass.onrender.com/api/admin/bookings" \
 -H "Authorization: Bearer <JWT-token>"
```

**Response 200 (Success)**

```
[
  {
    "_id": "<booking-id>",
    "user": {
      "_id": "<user-id>",
      "name": "Alice",
      "email": "alice@example.com"
    },
    "service": {
      "_id": "<service-id>",
      "name": "Hundbad liten",
      "duration": 45,
      "price": 500
    },
    "date": "2025-11-10T10:00:00Z",
    "notes": "Liten hund, extra omsorg",
    "status": "pending"
  }
]
```

**Response 500 (serverfel)**

```
{ "error": "fel vid hämtningar av bokningar" }
```

### PUT /bookings/:id/status

Uppdatera status på bokning (pending / confirmed / cancelled)

```
curl -X PUT "https://glans-and-tass.onrender.com/api/admin/bookings/<booking-id>/status" \
 -H "Authorization: Bearer <JWT-token>" \
 -H "Content-Type: application/json" \
 -d '{
"status": "confirmed"
}'
```

**Response 200 (Success)**

```
{
  "message": "bokning uppdaterad till confirmed",
  "booking": {
    "_id": "<booking-id>",
    "user": {
      "_id": "<user-id>",
      "name": "Alice",
      "email": "alice@example.com"
    },
    "service": {
      "_id": "<service-id>",
      "name": "Hundbad liten"
    },
    "date": "2025-11-10T10:00:00Z",
    "notes": "Liten hund, extra omsorg",
    "status": "confirmed"
  }
}
```

**Response 400 (ogiltig status)**

```
{ "error": "ogiltig status" }
```

**Response 404 (bokningen hittades inte)**

```
{ "error": "bokningen hittades inte" }
```

**Response 500 (serverfel)**

```
{ "error": "fel vid uppdatering av bokningsstatus" }
```
