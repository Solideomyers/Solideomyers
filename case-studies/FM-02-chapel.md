# FM-02 · Chapel
<sub>Nonprofit publisher · Book distribution · In use since late 2025 · Fullstack on Google Workspace — <i>Editorial sin fines de lucro · Distribución de libros · En uso desde finales de 2025 · Fullstack sobre Google Workspace</i></sub>

| SECTOR | MODULES | STACK | STATUS |
|---|---|---|---|
| Nonprofit · Logistics | Warehouses · Inventory · Batch entries & exits · Reports · Users | Google Apps Script · Google Sheets · Chart.js | In use |

## Context · Contexto
Chapel is the inventory system behind a nonprofit publisher's book distribution in Venezuela, which ships from two warehouses: Puerto Ordaz and Maracay.

## Problem · Problema
The team needed shared, up-to-date stock for both warehouses, a record of every entry and exit, and reports they could print or send.

## Constraints · Restricciones
- It had to run on the Google Workspace the team already uses, with no server costs.
- Mobile-first: entries and exits are registered from the phone.
- The data has to stay readable by people in a spreadsheet, for audits.

## Solution · Solución
- **Platform:** a single-page app on Google Apps Script with Google Sheets as the database (inventory, movement history, archived history, users). It runs on Workspace, so there are no server costs.
- **Movements:** batch entries and exits per warehouse, saved as a single block so a batch is recorded whole. Leaving a form with unsaved items asks for confirmation first.
- **Dashboard:** stock per warehouse, stock distribution, alerts and today's movements.
- **Reports:** PDF and Excel inventory and order reports per warehouse, filtered by stock available or critical stock (0–10).
- **Automation:** a daily low-stock email alert, and automatic archiving of history older than six months.
- **Access:** four roles (Super Admin, Admin, User, Guest) with an approval flow, plus a team chat with presence.

## Outcome · Resultado
- 594 titles and 2,731 units tracked across 2 warehouses, with every movement logged since December 2025.
- Next step, in progress: a rewrite on Next.js, NestJS and PostgreSQL to take the app further.

## Screens · Pantallas
<img alt="Chapel mobile app: dashboard, stock charts, batch entry and recent activity" src="../assets/shots/chapel.png" width="100%">

---
Want something similar? [WhatsApp](https://wa.me/584249080683) · [LinkedIn](https://linkedin.com/in/franciscomyers)
