enum Imagen {
	Lotus = 'https://lotusjeans.com.co/wp-content/uploads/2020/07/Lotus-Logo.png',
	Mistral = 'https://d3ugyf2ht6aenh.cloudfront.net/stores/001/369/862/themes/common/logo-521951243-1601909929-2bf0ba3b22a4b4227310edcfb7ff19eb1601909930-480-0.png?0',
	Detroit = 'detroit.png',
	Nasa = 'https://d2r9epyceweg5n.cloudfront.net/stores/001/155/301/themes/common/logo-912012163-1586914602-e6e3e9b66c8aeb12e24cb23ea73467591586914602-480-0.jpg?0',
	Raiders = 'https://static.wixstatic.com/media/031b90_534f8e7a5ce14c32982407f0df15296e~mv2.png/v1/fill/w_210,h_66,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/logo_raiders.png'
}

export const dataImg: { name: string; src: string; id: string }[] = [
	{ name: 'Lotus', src: Imagen.Lotus, id: '1' },
	{ name: 'Mistral', src: Imagen.Mistral, id: '2' },
	{ name: 'Detroit', src: Imagen.Detroit, id: '3' },
	{ name: 'Nasa', src: Imagen.Nasa, id: '4' },
	{ name: 'Raiders', src: Imagen.Raiders, id: '5' }
];
