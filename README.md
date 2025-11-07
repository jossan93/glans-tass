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
- Administrativa funktioner för användare finns fullt implementerade via backend och admin dashboard.
- Responsiv design som fungerar på både dator och mobil

## Teknisk stack

- **Frontend:** React + TypeScript
- **Backend:** Node.js / Express (JWT-baserad autentisering)
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

> ⚠️ Notera: Skapa nya tjänster som admin finns implementerat i backend, men är ännu ej tillgängligt via frontend.

## Bildkällor

Alla bilder som används på webbplatsen kommer från [Pexels](https://www.pexels.com) och är fria att använda enligt deras licensvillkor. 
 
En komplett lista över bilder och deras källor finns i:

[image-sources.md](./image-sources.md)
