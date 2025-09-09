'use client';

import React from 'react';

function scrollToTop() {
	document.body.scrollTop = 0;
	scrollTo({ top: 0, behavior: 'smooth' });
	setTimeout(() => document.getElementById('back-to-top-button')?.blur(), 300);
}

export default function BackToTopButtonClient({
	children,
	...props
}: React.HTMLAttributes<HTMLButtonElement>) {
	const [scrollY, setScrollY] = React.useState(0);

	React.useEffect(() => {
		function ev() {
			setScrollY(window.pageYOffset);
		}

		window.addEventListener('scroll', ev);
		ev();
        
		return () => window.removeEventListener('scroll', ev);
	}, []);

	React.useEffect(() => {
		const button = document.getElementById('back-to-top-button');
		if (button) {
			button.style.display = scrollY > 600 ? 'flex' : 'none';
		}
	}, [scrollY]);

	return (
		<button id='back-to-top-button' onClick={scrollToTop} {...props}>
			{children}
		</button>
	);
}
