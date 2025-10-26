// IMPORT BIBLIOTEK///

const express = require('express')
const cors = require('cors')
const fetch = require('node-fetch')
const dotenv = require('dotenv')

dotenv.config()

// KONFIGURACJA SERWERA//

const app = express()
const PORT = process.env.PORT || 3000

// MIDDLEWARE (pośrednicy) ///

const allowedOrigins = [
    'http://localhost:3000',
    'https://malina19.github.io'
];

app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(null, true); // Tymczasowo pozwól wszystkim
        }
    }
}));
app.use(express.json())
app.use(express.static('./frontend'));

// ENDPOINT DO WYSZUKIWANIA LOTÓW//

// Endpoint: GET /api/flights

app.get('/api/flights', async (req, res) => {
	try {
		const { departure, arrival, departDate, returnDate, passengers, tripType } = req.query
		console.log('Otrzymano zapytanie:', { departure, arrival, departDate, returnDate, passengers, tripType })

		let url = `https://serpapi.com/search.json?engine=google_flights`
		url += `&departure_id=${departure}`
		url += `&arrival_id=${arrival}`
		url += `&outbound_date=${departDate}`
		url += `&currency=PLN`
		url += `&hl=pl`

		if (tripType === 'roundTrip') { // zmień 'type' na 'tripType'
			url += `&return_date=${returnDate}`
			url += `&type=1`
		} else {
			url += `&type=2`
		}

		if (passengers && passengers > 1) {
			url += `&adults=${passengers}`
		}
		url += `&api_key=${process.env.SERPAPI_KEY}`
		console.log('Wywołuje SerpApi...')

		const response = await fetch(url)

		if (!response.ok) {
			throw new Error(`SerpApi error: ${response.status}`)
		}

		const data = await response.json()
		console.log('Dane pobrane, zwracam do frontendu')

		res.json(data)
	} catch (error) {
		console.log('Błąd:', error.message);
		res.status(500).json({
			error: 'Błąd serwera',
			details: error.message,
		})
	}
})

// ENDPOINT DO WYSZUKIWANIA HOTELI//

// Endpoint: GET /api/hotels            

app.get('/api/hotels', async (req, res) => {
    try {
        const { location, checkIn, checkOut, adults, children } = req.query;

        console.log('Otrzymano zapytanie o hotele:',
            location,
            checkIn,
            checkOut,
            adults,
            children
        );

        if (!location || !checkIn || !checkOut) {
            return res.status(400).json({
                error: 'Brak wymaganych parametrów (location, checkIn, checkOut)'
            });
        }

        let url = `https://serpapi.com/search.json?engine=google_hotels`;
        url += `&q=${encodeURIComponent(location)}`;
        url += `&check_in_date=${checkIn}`;
        url += `&check_out_date=${checkOut}`;
        url += `&adults=${adults || 2}`;
        url += `&currency=PLN`;
        url += `&gl=pl`;
        url += `&hl=pl`;

        if (children && children > 0) {
            url += `&children=${children}`;
        }

        url += `&api_key=${process.env.SERPAPI_KEY}`;

        console.log('Wywołuje SerpApi (Google Hotels)...');

        const response = await fetch(url);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Błąd SerpApi:', errorText);
            throw new Error(`SerpApi error: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Dane pobrane, zwracam do frontendu');
        console.log(`📊 Znaleziono hoteli: ${data.properties?.length || 0}`);

        res.json(data);
    } catch (error) {
        console.error('❌ Błąd:', error.message);
        res.status(500).json({
            error: 'Błąd serwera',
            details: error.message,
        });
    }
});






// ENDPOINT TESTOWY//

app.get('/api/test', (req, res) => {
	res.json({ message: 'Serwer działa!' })
})

// START SERWERA///

app.listen(PORT, () => {
	console.log(`✅ Serwer działa na http://localhost:${PORT}`)
	console.log(`📡 API endpoint: http://localhost:${PORT}/api/flights`)
	console.log(`🧪 Test endpoint: http://localhost:${PORT}/api/test`)
})
