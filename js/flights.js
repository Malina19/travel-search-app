// ============================================
// KONFIGURACJA
// ============================================
const API_URL =
	window.location.hostname === 'localhost'
		? 'http://localhost:3000'
		: 'https://travel-search-app-production.up.railway.app'

// ============================================
// INICJALIZACJA PO ZAŁADOWANIU STRONY
// ============================================
document.addEventListener('DOMContentLoaded', () => {
	const form = document.querySelector('.search-form')
	const departureInput = document.getElementById('departure')
	const arrivalInput = document.getElementById('arrival')
	const departDateInput = document.getElementById('departDate')
	const returnDateInput = document.getElementById('returnDate')
	const passengersInput = document.getElementById('passengers')
	const tripTypeInputs = document.querySelectorAll('input[name="tripType"]')

	// Obsługa radio buttonów (pokaż/ukryj datę powrotu)
	tripTypeInputs.forEach(input => {
		input.addEventListener('change', e => {
			const returnDateGroup = document.querySelector('.return-date')
			if (e.target.value === 'oneWay') {
				returnDateGroup.style.display = 'none'
				returnDateInput.removeAttribute('required')
			} else {
				returnDateGroup.style.display = 'flex'
				returnDateInput.setAttribute('required', 'required')
			}
		})
	})

	// Obsługa wysłania formularza
	form.addEventListener('submit', async e => {
		e.preventDefault()

		const departure = departureInput.value.trim().toUpperCase()
		const arrival = arrivalInput.value.trim().toUpperCase()
		const departDate = departDateInput.value
		const returnDate = returnDateInput.value
		const passengers = passengersInput.value
		const tripType = document.querySelector('input[name="tripType"]:checked').value

		// Walidacja
		if (!departure || !arrival) {
			showError('Wprowadź kody lotnisk (np. WAW, JFK)')
			return
		}

		if (departure.length !== 3 || arrival.length !== 3) {
			showError('Kody lotnisk muszą mieć 3 litery (np. WAW, JFK)')
			return
		}

		if (tripType === 'roundTrip' && !returnDate) {
			showError('Wybierz datę powrotu dla biletu w dwie strony')
			return
		}

		showLoading()

		try {
			const flights = await searchFlights(departure, arrival, departDate, returnDate, passengers, tripType)
			displayFlights(flights)
		} catch (error) {
			showError('Nie udało się pobrać lotów. Sprawdź kody lotnisk i spróbuj ponownie.')
			console.error('Błąd:', error)
		}
	})

	form.addEventListener('reset', () => {
		let resultsContainer = document.querySelector('.flights-results')
		const returnDateGroup = document.querySelector('.return-date')
		if (returnDateGroup) {
			returnDateGroup.style.display = 'flex'
		}
		if (resultsContainer) {
			resultsContainer.innerHTML = ''
		}
		hideLoading()
	})
})
// ============================================
// GŁÓWNA FUNKCJA WYSZUKIWANIA
// ============================================
async function searchFlights(departure, arrival, departDate, returnDate, passengers, tripType) {
	try {
		let url = `${API_URL}/api/flights?`
		url += `departure=${departure}`
		url += `&arrival=${arrival}`
		url += `&departDate=${departDate}`
		url += `&passengers=${passengers}`
		url += `&type=${tripType}`

		if (tripType === 'roundTrip') {
			url += `&returnDate=${returnDate}`
		}

		console.log('📤 Wysyłam zapytanie do mojego backendu:', url)

		const response = await fetch(url)

		if (!response.ok) {
			throw new Error(`Błąd HTTP: ${response.status}`)
		}

		const data = await response.json()
		console.log('📥 Otrzymano dane z backendu:', data)

		const flights = data.best_flights || data.other_flights || data.flights || []

		return flights
	} catch (error) {
		console.error('❌ Błąd:', error)
		throw error
	}
}

// ============================================
// WYŚWIETLANIE WYNIKÓW
// ============================================
function displayFlights(flights) {
	hideLoading()

	let resultsContainer = document.querySelector('.flights-results')
	if (!resultsContainer) {
		resultsContainer = document.createElement('div')
		resultsContainer.className = 'flights-results'
		document.querySelector('.flights').appendChild(resultsContainer)
	}

	resultsContainer.innerHTML = ''

	if (!flights || flights.length === 0) {
		resultsContainer.innerHTML =
			'<p class="no-results">Nie znaleziono lotów dla podanych kryteriów. Spróbuj innych dat lub lotnisk.</p>'
		return
	}

	flights.forEach(flight => {
		const flightCard = createFlightCard(flight)
		resultsContainer.appendChild(flightCard)
	})
}

// ============================================
// TWORZENIE KAFELKA LOTU
// ============================================
function createFlightCard(flight) {
	const card = document.createElement('div')
	card.className = 'flight-card'

	const outbound = flight.flights[0]
	const duration = formatDuration(outbound.duration)

	card.innerHTML = `
        <div class="flight-card__header">
            <img src="${outbound.airline_logo}" alt="${outbound.airline}" class="flight-card__logo">
            <span class="flight-card__airline">${outbound.airline}</span>
        </div>
        
        <div class="flight-card__route">
            <div class="flight-card__departure">
                <div class="flight-card__time">${outbound.departure_airport.time}</div>
                <div class="flight-card__airport">${outbound.departure_airport.id}</div>
            </div>
            
            <div class="flight-card__duration">
                <i class="fa-solid fa-plane"></i>
                <div>${duration}</div>
                ${outbound.often_delayed_by_over_30_min ? '<span class="delay-warning">⚠️ Często opóźniony</span>' : ''}
            </div>
            
            <div class="flight-card__arrival">
                <div class="flight-card__time">${outbound.arrival_airport.time}</div>
                <div class="flight-card__airport">${outbound.arrival_airport.id}</div>
            </div>
        </div>
        
        <div class="flight-card__info">
            <span>Numer lotu: ${outbound.flight_number}</span>
            ${outbound.overnight ? '<span class="overnight">🌙 Lot nocny</span>' : ''}
        </div>
        
        <div class="flight-card__footer">
            <div class="flight-card__price">${flight.price} PLN</div>
            <button class="btn btn--primary btn--small">Wybierz</button>
        </div>
    `

	return card
}

// ============================================
// FUNKCJE POMOCNICZE
// ============================================
function formatDuration(minutes) {
	const hours = Math.floor(minutes / 60)
	const mins = minutes % 60
	return `${hours}h ${mins}m`
}

function showLoading() {
	let loader = document.querySelector('.loading')
	if (!loader) {
		loader = document.createElement('div')
		loader.className = 'loading'
		loader.innerHTML = '<div class="spinner"></div><p>Szukam lotów...</p>'
		document.querySelector('.flights').appendChild(loader)
	}
	loader.style.display = 'block'
}

function hideLoading() {
	const loader = document.querySelector('.loading')
	if (loader) {
		loader.style.display = 'none'
	}
}

function showError(message) {
	hideLoading()
	let resultsContainer = document.querySelector('.flights-results')
	if (!resultsContainer) {
		resultsContainer = document.createElement('div')
		resultsContainer.className = 'flights-results'
		document.querySelector('.flights').appendChild(resultsContainer)
	}
	resultsContainer.innerHTML = `<p class="error-message">${message}</p>`
}
