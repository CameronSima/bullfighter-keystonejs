var toggle = function(id) {
	var el = document.getElementById('notes_' + id)
	var msgEl = document.getElementById('toggle_link_' + id)

	if (el.style.display === 'block') {
		el.style.display = 'none'
		msgEl.innerText = 'Read More...'
	} else {
		el.style.display = 'block'
		msgEl.innerText = 'Read Less...' 
	}
}