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

	const token = CustomCaptcha._last_response;
	const long = document.getElementById('long').value;

	fetch('/shorten', {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ long, token }),
	}).then(async (response) => {

		CustomCaptcha.reset();
		document.getElementById('long').value = '';

		const data = await response.json();

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
					navigator.clipboard.writeText(`${location.hostname}/${data.shortURL}`);
				}
			});
		} else {
			alert('Error');
		}
	});
});