# Glans & Tass

Ett bokningssystem för djurvård och grooming (hund och katt).  
Användare kan registrera konto, logga in och boka tjänster online.  
Administratörer kan hantera användare via ett dashboard.

**Live:** [https://glansochtass.netlify.app/](https://glansochtass.netlify.app/)  
**Backend API:** [https://glans-and-tass.onrender.com/api](https://glans-and-tass.onrender.com/api)

## Funktionalitet

- Boka tider för olika tjänster (kloklipp, badning, klippning, m.m.)
- Skapa och hantera användarkonton
- Logga in / registrera
- Administrativa funktioner för användare finns fullt implementerade i backend (CRUD), men hantering av bokningar via admin-dashboard är ännu inte färdigutvecklat.
- Responsiv design – fungerar på både dator och mobil

## Teknisk stack

- **Frontend:** React + TypeScript
- **Backend:** Node.js / Express
- **Databas:** MongoDB
- **API:** RESTful

## UX & Design

### Persona

[Figma Persona](https://www.figma.com/design/flNiNMKdqb2atmuUEIIqF3/U10?node-id=0-1&t=L9DRP5jEn7CY5Ljz-1)

### Wireframe

[Figma Wireframe](https://www.figma.com/design/flNiNMKdqb2atmuUEIIqF3/U10?node-id=1-2&t=L9DRP5jEn7CY5Ljz-1)

### Sitemap

[Figma Sitemap](https://www.figma.com/board/aBDn7CMzYlJtgA0uN7hPyN/sitemap-djur-grooming?node-id=0-1&t=bQ0TPAsfh3LqelY8-1)

### User stories

[Google Docs User Stories](https://docs.google.com/document/d/1yTtU75gZznBuNm5jdNN1ELKYz4MXKIodXbXRmst5IhA/edit?usp=sharing)

## API-dokumentation

All information om alla endpoints (User, Service, Booking, Admin) finns i:  
[API.md](./API.md)

> ⚠️ Notera: Admin-endpoints för användare fungerar fullt, men hantering av bokningar via admin är ej färdigutvecklat på frontend.
