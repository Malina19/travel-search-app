// Chowanie i pojawianie się navbaru przy srollu
let prevScrollpos = window.scrollY
const navbar = document.getElementById('navbar')
const sticky = navbar.offsetTop

window.onscroll = function () {
	onscroll_function()
}

function onscroll_function() {
	navFunction()
}

function navFunction() {
	let currentScrollPos = window.scrollY
	if (prevScrollpos > currentScrollPos) {
		document.getElementById('navbar').style.top = '0'
	} else {
		document.getElementById('navbar').style.top = '-8vh'
	}
	prevScrollpos = currentScrollPos
}
