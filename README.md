# ✈️🏨 Travel Search App

Full-stack aplikacja do wyszukiwania lotów i hoteli wykorzystująca SerpApi (Google Flights & Hotels API).

## 🚀 Live Demo
👉 **[Zobacz działającą aplikację](https://Malina19.github.io/travel-search-app/)**

Backend: [https://travel-search-backend-xxxx.onrender.com](https://travel-search-backend-xxxx.onrender.com/api/test)



## ✨ Funkcje

- 🔍 Wyszukiwanie lotów (w jedną stronę / w dwie strony)
- 🏨 Wyszukiwanie hoteli z filtrowaniem dat i liczby gości
- 💰 Wyświetlanie cen w PLN
- ⭐ Oceny i opinie hoteli
- 📱 W pełni responsywny design (mobile-first)
- 🔒 Bezpieczne przechowywanie klucza API na backendzie
- ⚡ Szybkie wyszukiwanie w czasie rzeczywistym

## 🛠️ Technologie

### Frontend
- HTML5, CSS3 (SCSS)
- Vanilla JavaScript (ES6+)
- Responsywny design
- Font Awesome icons

### Backend
- Node.js v18+
- Express.js
- SerpApi (Google Flights & Hotels API)
- CORS
- dotenv

## 💻 Instalacja lokalna

### Wymagania
- Node.js v18 lub nowszy
- Klucz API z [SerpApi](https://serpapi.com) (darmowe 100 zapytań/miesiąc)

### Kroki

1. **Sklonuj repozytorium**
```bash
git clone https://github.com/twoja-nazwa-github/travel-search-app.git
cd travel-search-app
```

2. **Zainstaluj zależności backendu**
```bash
cd backend
npm install
```

3. **Skonfiguruj zmienne środowiskowe**

Stwórz plik `backend/.env`:
```env
SERPAPI_KEY=twoj_klucz_api
PORT=3000
```

4. **Uruchom backend**
```bash
npm start
```

Backend będzie dostępny na: `http://localhost:3000`

5. **Otwórz frontend**

Otwórz plik `index.html` w przeglądarce lub użyj live server.

## 📁 Struktura projektu
```
travel-search-app/
├── backend/              # Node.js server
│   ├── server.js        # Główny plik serwera
│   ├── package.json     # Zależności Node.js
│   └── .env            # Zmienne środowiskowe (gitignored)
├── css/                 # Style
│   ├── main.css
│   ├── flights.css
│   └── hotels.css
├── js/                  # JavaScript
│   ├── main.js
│   ├── flights.js
│   └── hotels.js
├── index.html           # Strona główna
├── flights.html         # Wyszukiwarka lotów
├── hotels.html          # Wyszukiwarka hoteli
├── .gitignore
└── README.md
```

## 🔒 Bezpieczeństwo

- Klucz API przechowywany w zmiennych środowiskowych
- Backend działa jako proxy - klucz nigdy nie jest widoczny w przeglądarce
- CORS skonfigurowany tylko dla dozwolonych domen
- `.env` w `.gitignore` (nie trafia na GitHub)

## 🌐 Deployment

- **Backend:** Render.com (darmowy tier)
- **Frontend:** GitHub Pages
- **CI/CD:** Automatyczne deploye przez Git push

### Backend (Render.com)

1. Połącz repo z Render
2. Ustaw Root Directory: `backend`
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Dodaj zmienne środowiskowe: `SERPAPI_KEY`, `PORT=10000`

### Frontend (GitHub Pages)

1. Settings → Pages
2. Source: Branch `main`, folder `/root`
3. Gotowe!

## 📱 Responsywność

Aplikacja jest w pełni responsywna i działa na:
- 📱 Telefonach (320px+)
- 📱 Tabletach (768px+)
- 💻 Laptopach (1024px+)
- 🖥️ Desktopach (1200px+)

## 🎓 Cel projektu

Projekt powstał jako część portfolio do pokazania umiejętności:
- Full-stack development (frontend + backend)
- Integracja z zewnętrznymi API
- Responsywny design
- Deployment na produkcję
- Git & GitHub workflow

## 📧 Kontakt

Masz pytania? Napisz: (dawid.malik.it@gmail.com)

LinkedIn: [Dawid Malik - Manual tester](https://www.linkedin.com/in/dawid-m-016574254/)

GitHub: [@Malina19](https://github.com/Malina19/travel-search-app)

## 📄 Licencja

MIT License - możesz swobodnie używać w swoim portfolio!

---

⭐ Jeśli podoba Ci się projekt, zostaw gwiazdkę na GitHub! ⭐