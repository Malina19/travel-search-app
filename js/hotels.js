// ============================================
// KONFIGURACJA
// ============================================

const API_URL =
	window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'travel-search-app-production.up.railway.app'

// ============================================
// INICJALIZACJA PO ZAŁADOWANIU STRONY
// ============================================

document.addEventListener('DOMContentLoaded', () => {
	console.log('🏨 Hotels.js załadowany')

	const form = document.querySelector('.search-form--hotels')
	const locationInput = document.getElementById('hotelLocation')
	const checkInInput = document.getElementById('checkIn')
	const checkOutInput = document.getElementById('checkOut')
	const adultsInput = document.getElementById('adults')
	const childrenInput = document.getElementById('children')

	if (!form) {
		console.error('❌ Nie znaleziono formularza hoteli')
		return
	}

	console.log('✅ Formularz hoteli znaleziony')

	const today = new Date().toISOString().split('T')[0]
	checkInInput.min = today
	checkOutInput.min = today

	checkInInput.addEventListener('change', () => {
		checkOutInput.min = checkInInput.value
		if (checkOutInput.value && checkOutInput.value <= checkInInput.value) {
			checkOutInput.value = ''
		}
	})

	form.addEventListener('submit', async e => {
		e.preventDefault()
		console.log('📤 Formularz wysłany')

		const location = locationInput.value.trim()
		const checkIn = checkInInput.value
		const checkOut = checkOutInput.value
		const adults = adultsInput.value
		const children = childrenInput.value

		if (!location) {
			showError('Wpisz lokalizację (miasto lub region)')
			return
		}

		if (!checkIn || !checkOut) {
			showError('Wybierz daty pobytu')
			return
		}

		if (checkOut <= checkIn) {
			showError('Data wymeldowania musi być późniejsza niż zameldowania')
			return
		}

		showLoading()

		try {
			const hotels = await searchHotels(location, checkIn, checkOut, adults, children)
			displayHotels(hotels)
		} catch (error) {
			showError('Nie udało się pobrać hoteli. Spróbuj ponownie.')
			console.error('❌ Błąd:', error)
		}
	})
})

// ============================================
// GŁÓWNA FUNKCJA WYSZUKIWANIA
// ============================================

async function searchHotels(location, checkIn, checkOut, adults, children) {
	try {
		let url = `${API_URL}/api/hotels?`
		url += `location=${encodeURIComponent(location)}`
		url += `&checkIn=${checkIn}`
		url += `&checkOut=${checkOut}`
		url += `&adults=${adults}`

		if (children > 0) {
			url += `&children=${children}`
		}

		console.log('📤 Wysyłam zapytanie:', url)

		const response = await fetch(url)

		if (!response.ok) {
			throw new Error(`Błąd HTTP: ${response.status}`)
		}

		const data = await response.json()
		console.log('📥 Otrzymano dane:', data)

		const hotels = data.properties || []
		return hotels.slice(0, 5)
	} catch (error) {
		console.error('❌ Błąd wyszukiwania:', error)
		throw error
	}
}

// ============================================
// WYŚWIETLANIE WYNIKÓW
// ============================================

function displayHotels(hotels) {
	hideLoading()

	let resultsContainer = document.querySelector('.hotels-results')
	if (!resultsContainer) {
		resultsContainer = document.createElement('div')
		resultsContainer.className = 'hotels-results'
		document.querySelector('.hotels').appendChild(resultsContainer)
	}

	resultsContainer.innerHTML = ''

	if (!hotels || hotels.length === 0) {
		resultsContainer.innerHTML =
			'<p class="no-results">Nie znaleziono hoteli dla podanych kryteriów. Spróbuj innej lokalizacji lub dat.</p>'
		return
	}

	console.log(`📊 Wyświetlam ${hotels.length} hoteli`)

	hotels.forEach(hotel => {
		const hotelCard = createHotelCard(hotel)
		resultsContainer.appendChild(hotelCard)
	})
}

// ============================================
// TWORZENIE KAFELKA HOTELU
// ============================================

function createHotelCard(hotel) {
	const card = document.createElement('div')
	card.className = 'hotel-card'

	const name = hotel.name || 'Nazwa niedostępna'
	const type = hotel.type || 'Hotel'
	const rating = hotel.overall_rating || hotel.rating || 0
	const reviews = hotel.reviews || 0
	const description = hotel.description || 'Brak opisu'

	// ============================================
	// POPRAWIONA OBSŁUGA ZDJĘĆ
	// ============================================

	let image = null

	// KROK 1: Sprawdź czy są zdjęcia w tablicy "images"
	if (hotel.images && Array.isArray(hotel.images) && hotel.images.length > 0) {
		// WAŻNE: images[0] to OBIEKT, nie string!
		const firstImage = hotel.images[0]

		// Wybierz original_image (wysoka jakość) lub thumbnail
		image = firstImage.original_image || firstImage.thumbnail

		console.log('✅ Znaleziono zdjęcie:', image)
	}
	// KROK 2: Fallback - inne możliwe źródła
	else if (hotel.thumbnail) {
		image = hotel.thumbnail
	} else if (hotel.image) {
		image = hotel.image
	}

	// KROK 3: Jeśli NADAL brak zdjęcia, użyj SVG
	if (!image) {
		console.warn('⚠️ Brak zdjęcia dla:', name)
		image =
			'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="200"%3E%3Crect fill="%23e8e8e8" width="400" height="200"/%3E%3Ctext fill="%23999" font-family="Arial, sans-serif" font-size="18" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3E🏨 Hotel%3C/text%3E%3C/svg%3E'
	}

	const price = hotel.rate_per_night?.lowest || hotel.total_rate?.lowest || 'Cena niedostępna'
	const link = hotel.link || '#'

	const stars = rating > 0 ? '★'.repeat(Math.round(rating)) : ''
	const amenities = hotel.amenities || []

	// ============================================
	// HTML KAFELKA
	// ============================================

	card.innerHTML = `
        <img 
            src="${image}" 
            alt="${name}" 
            class="hotel-card__image" 
            loading="lazy"
        >
        
        <div class="hotel-card__content">
            <div class="hotel-card__header">
                <h3 class="hotel-card__name">${name}</h3>
                <div class="hotel-card__rating-container">
                    ${stars ? `<div class="hotel-card__stars">${stars}</div>` : ''}
                    ${
											rating > 0
												? `
                        <div class="hotel-card__rating">
                            <span class="hotel-card__rating-score">${rating.toFixed(1)}</span>
                            ${reviews > 0 ? `<span class="hotel-card__reviews">(${reviews} opinii)</span>` : ''}
                        </div>
                    `
												: ''
										}
                </div>
            </div>
            
            <span class="hotel-card__type">${type}</span>
            
            ${
							hotel.gps_coordinates
								? `
                <div class="hotel-card__location">
                    <i class="fa-solid fa-location-dot"></i>
                    <span>${hotel.gps_coordinates.latitude.toFixed(3)}, ${hotel.gps_coordinates.longitude.toFixed(
										3
								  )}</span>
                </div>
            `
								: ''
						}
            
            <p class="hotel-card__description">${description}</p>
            
            ${
							amenities.length > 0
								? `
                <div class="hotel-card__amenities">
                    ${amenities
											.slice(0, 4)
											.map(
												amenity => `
                        <span class="hotel-card__amenity">
                            <i class="fa-solid fa-check"></i>
                            ${amenity}
                        </span>
                    `
											)
											.join('')}
                </div>
            `
								: ''
						}
            
            <div class="hotel-card__footer">
                <div class="hotel-card__price-container">
                    <span class="hotel-card__price-label">Od</span>
                    <span class="hotel-card__price">${price}</span>
                    <span class="hotel-card__price-per-night">za noc</span>
                </div>
                <a href="${link}" target="_blank" class="hotel-card__button">
                    Zobacz ofertę
                    <i class="fa-solid fa-arrow-right"></i>
                </a>
            </div>
        </div>
    `

	return card
}

// ============================================
// FUNKCJE POMOCNICZE
// ============================================

function showLoading() {
	let loader = document.querySelector('.loading')
	if (!loader) {
		loader = document.createElement('div')
		loader.className = 'loading'
		loader.innerHTML = '<div class="spinner"></div><p>Szukam hoteli...</p>'
		document.querySelector('.hotels').appendChild(loader)
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
	let resultsContainer = document.querySelector('.hotels-results')
	if (!resultsContainer) {
		resultsContainer = document.createElement('div')
		resultsContainer.className = 'hotels-results'
		document.querySelector('.hotels').appendChild(resultsContainer)
	}
	resultsContainer.innerHTML = `<p class="error-message">${message}</p>`
}
