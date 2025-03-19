# 🌍 App de Turisme i Gimcana Grupal

📌 **Descripció del projecte**  
Aquesta aplicació web és una plataforma de turisme que permet als administradors gestionar llocs d'interès (com restaurants, museus, monuments, etc.) en un mapa interactiu i als usuaris descobrir-los mitjançant filtres personalitzats. A més, inclou una funcionalitat de gimcana grupal on els usuaris poden completar recorreguts col·laboratius amb provas i pistes.

🎯 **Objectiu**  
Desenvolupar una eina web que faciliti la gestió i visualització de llocs d'interès en un mapa, integrant funcionalitats avançades com la geocodificació, el filtrat per etiquetes i la creació de rutes dinàmiques. També es vol implementar una gimcana grupal que fomenti la interacció entre els participants.

---

⚙️ **Funcionalitats principals**

### 1️⃣ Part Administrador
✔️ **Gestió de llocs d'interès**  
- Afegir, editar i eliminar llocs amb adreça completa o coordenades via Geocodificació.  
- Assignar múltiples etiquetes (tags) per classificar cada lloc.  
- Personalitzar icones i colors dels marcadors al mapa.  

✔️ **Definició de punts de control per a la gimcana**  
- Crear i gestionar proves i pistes associades als llocs.  
- Utilitzar descripcions i etiquetes de Google Maps per definir punts de control.  
- Filtrar llocs per etiquetes i favorits.  

✔️ **Base de dades estructurada**  
- Emmagatzemar informació sobre llocs, etiquetes, usuaris i provas de la gimcana.  
- Consultes eficients per filtrar, crear, actualitzar i eliminar registres.  

### 2️⃣ Part Usuari
✔️ **Registre i autenticació**  
- Registre obligatori per accedir a la guia de llocs d'interès.  
- Sistema d'autenticació segura amb Laravel Auth.  

✔️ **Visualització de llocs en un mapa**  
- Mostrar tots els llocs en un únic mapa amb filtres:  
  - Favorits  
  - Etiquetes  
  - Llocs propers basats en la ubicació actual  
- Fitxa detallada del lloc amb informació bàsica i ruta fins al destí (plugin routing).  

✔️ **Funcionalitats de la gimcana grupal**  
- Crear o unir-se a grups per participar en gimcanes.  
- Validar que tots els membres del grup han visitat cada punt de control.  
- Visualitzar pistes i proves associades a cada lloc de la gimcana.  

---

🛠️ **Requisits tècnics**

### Backend
- **Framework:** Laravel  
- **Autenticació:** Laravel Auth  
- **Base de dades:** MySQL (gestió amb migracions i seeders)  
- **Transaccions:** Control de consistència de dades  
- **AJAX:** Ús de fetch per extreure informació de la BD i retornar JSON  

### Frontend
- **HTML5 + CSS3 + Bootstrap**  
- **Fonts i Icones:** Font Awesome  
- **Mapes:** Integració amb API de Google Maps o alternativa similar  
- **Routing:** Plugin de càlcul de rutes  
- **Disseny responsiu:** Adaptat per a dispositius mòbils  

### Hosting i Gestió
- **Desplegament:** Hosting web compatible amb Laravel  
- **GitHub:** Repositori privat amb branques coherents, issues i milestones  
- **Scrum:** Reunions diàries documentades en Excel  

---

📅 **Planificació (Roadmap)**  
- **Sprint 1:** Configuració inicial del projecte (Laravel, base de dades, GitHub).  
- **Sprint 2:** Implementació de la part administrador (gestió de llocs i tags).  
- **Sprint 3:** Desenvolupament de la part usuari (visualització de mapes i filtres).  
- **Sprint 4:** Funcionalitats de la gimcana grupal.  
- **Sprint 5:** Testing, ajustaments finals i desplegament.  

---

📝 **Informació addicional**
- **Equips:** Indicar els noms dels membres del grup i les seves responsabilitats.  
- **Demo:** La participació en la demo final és obligatòria per aprovar el projecte.  
- **Sortida pràctica:** Prova real de l'aplicació en un entorn extern.  

---

🌟 **Mockups i Prototipat**  
Els mockups seran creats amb Figma abans del desenvolupament per validar el disseny amb els professors.  
