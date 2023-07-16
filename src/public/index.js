CustomCaptcha.init({
	theme: 'dark',
	text: 'Dross',
	label: "I'm not a robot. 🙄",
	logo: 'https://i.imgur.com/AV2NHD5.png',
	siteKey: '6Lf7T6wmAAAAAD6ZRHliBCfxKAVgn2Vxiw5pOM_8',
});

document.getElementById('footer').addEventListener('click', () => {
	window.open('https://sujalgoel.me', '_blank').focus();
});

document.getElementById('shorten').addEventListener('submit', (e) => {
	e.preventDefault();

	// disable button to prevent multiple clicks

	const token = CustomCaptcha._last_response;
	const long = document.getElementById('long').value;

	document.getElementById('shorten').disabled = true;

	fetch('/shorten', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ long, token }),
	}).then(async (response) => {

		const data = await response.json();

		CustomCaptcha.reset();
		document.getElementById('long').value = '';
		document.getElementById('shorten').disabled = false;

		if (data.success) {
			Swal.fire({
				width: 'auto',
				focusConfirm: false,
				showCancelButton: false,
				showConfirmButton: true,
				background: 'transparent',
				confirmButtonColor: '#5865F2',
				confirmButtonText: '<span style="color: #000;"><b><i class="fa-regular fa-clipboard"></i> Copy to clipboard!</b></span>',
			}).then((result) => {
				if (result.value) {

					navigator.clipboard.writeText(`https://${location.hostname}/${data.shortURL}`);
				}
			});
		} else {
			alert('Error');
		}
	});
});