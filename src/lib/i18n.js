const translations = {
	en: {
		'home.title': 'Eschenbach Studio - Web Development & IT Consulting',
		'home.description': 'Technical solutions for small businesses in the Netherlands and Germany',
		'home.headline': 'Technical Solutions for Growing Businesses',
		'home.subtitle':
			'Building reliable websites, infrastructure, and automation tools for small firms across the Netherlands and Germany.',
		'services.title': 'Our Services',
		'services.websites': 'Websites & Web Apps',
		'services.websites_desc':
			'Modern web applications built with SvelteKit and other technologies, optimized for performance and user experience.',
		'services.infrastructure': 'Cloud Infrastructure',
		'services.infrastructure_desc':
			'Setup, configuration, and management of cloud infrastructure tailored to your business needs.',
		'services.automation': 'Automation & Integrations',
		'services.automation_desc':
			'Streamline your workflows with custom automation and seamless system integrations.',
		'services.consulting': 'IT Consulting',
		'services.consulting_desc':
			'Strategic guidance on technology decisions, cloud migration, and IT setup for your organization.',
		'cta.title': 'Ready to Start?',
		'cta.description':
			"Let's discuss how we can help your business grow with the right technical foundation.",
		'cta.button': 'Get in Touch',
		'nav.home': 'Home',
		'nav.services': 'Services',
		'nav.contact': 'Contact',
		'contact.title': 'Get in Touch',
		'contact.description':
			"Have a project in mind? Send us an email and let's explore how we can help.",
		'contact.email_label': 'Your Email',
		'contact.message_label': 'Your Message',
		'contact.submit': 'Send Message',
		'contact.email_placeholder': 'you@example.com',
		'contact.message_placeholder': 'Tell us about your project...',
		'footer.text': '© 2025 Eschenbach Studio. All rights reserved.',
	},
	nl: {
		'home.title': 'Eschenbach Studio - Webontwikkeling & IT Consulting',
		'home.description':
			'Technische oplossingen voor kleine bedrijven in Nederland en Duitsland',
		'home.headline': 'Technische Oplossingen voor Groeiende Bedrijven',
		'home.subtitle':
			'Bouw betrouwbare websites, infrastructuur en automatiseringstools voor kleine bedrijven in Nederland en Duitsland.',
		'services.title': 'Onze Diensten',
		'services.websites': 'Websites & Web Apps',
		'services.websites_desc':
			'Moderne webapplicaties gebouwd met SvelteKit en andere technologieën, geoptimaliseerd voor prestatie en gebruikerservaring.',
		'services.infrastructure': 'Cloud Infrastructuur',
		'services.infrastructure_desc':
			'Opzet, configuratie en beheer van cloudinfrastructuur afgestemd op uw bedrijfsbehoeften.',
		'services.automation': 'Automatisering & Integraties',
		'services.automation_desc':
			'Stroomlijn uw workflows met aangepaste automatisering en naadloze systeemintegraties.',
		'services.consulting': 'IT Consulting',
		'services.consulting_desc':
			'Strategische begeleiding bij technologiebeslissingen, cloudmigratie en IT-opzet voor uw organisatie.',
		'cta.title': 'Klaar om te Beginnen?',
		'cta.description':
			'Laten we bespreken hoe we uw bedrijf kunnen helpen groeien met de juiste technische basis.',
		'cta.button': 'Neem Contact Op',
		'nav.home': 'Home',
		'nav.services': 'Diensten',
		'nav.contact': 'Contact',
		'contact.title': 'Neem Contact Op',
		'contact.description':
			'Heb je een project in gedachten? Stuur ons een e-mail en laten we verkennen hoe we kunnen helpen.',
		'contact.email_label': 'Jouw E-mailadres',
		'contact.message_label': 'Jouw Bericht',
		'contact.submit': 'Bericht Verzenden',
		'contact.email_placeholder': 'jij@voorbeeld.nl',
		'contact.message_placeholder': 'Vertel ons over je project...',
		'footer.text': '© 2025 Eschenbach Studio. Alle rechten voorbehouden.',
	},
	de: {
		'home.title': 'Eschenbach Studio - Webentwicklung & IT-Beratung',
		'home.description':
			'Technische Lösungen für kleine Unternehmen in den Niederlanden und Deutschland',
		'home.headline': 'Technische Lösungen für Wachsende Unternehmen',
		'home.subtitle':
			'Erstelle zuverlässige Websites, Infrastruktur und Automatisierungswerkzeuge für kleine Unternehmen in den Niederlanden und Deutschland.',
		'services.title': 'Unsere Dienstleistungen',
		'services.websites': 'Websites & Web-Apps',
		'services.websites_desc':
			'Moderne Webanwendungen mit SvelteKit und anderen Technologien, optimiert für Leistung und Benutzererfahrung.',
		'services.infrastructure': 'Cloud-Infrastruktur',
		'services.infrastructure_desc':
			'Einrichtung, Konfiguration und Verwaltung von Cloud-Infrastruktur, die auf deine Geschäftsanforderungen zugeschnitten ist.',
		'services.automation': 'Automatisierung & Integrationen',
		'services.automation_desc':
			'Optimiere deine Workflows durch benutzerdefinierte Automatisierung und nahtlose Systemintegrationen.',
		'services.consulting': 'IT-Beratung',
		'services.consulting_desc':
			'Strategische Beratung zu Technologieentscheidungen, Cloud-Migration und IT-Setup für dein Unternehmen.',
		'cta.title': 'Bereit zu Beginnen?',
		'cta.description':
			'Lassen Sie uns besprechen, wie wir Ihr Unternehmen mit der richtigen technischen Grundlage unterstützen können.',
		'cta.button': 'Kontaktiere Uns',
		'nav.home': 'Startseite',
		'nav.services': 'Dienstleistungen',
		'nav.contact': 'Kontakt',
		'contact.title': 'Kontaktiere Uns',
		'contact.description':
			'Haben Sie ein Projekt im Sinn? Senden Sie uns eine E-Mail und lassen Sie uns erkunden, wie wir helfen können.',
		'contact.email_label': 'Deine E-Mail-Adresse',
		'contact.message_label': 'Deine Nachricht',
		'contact.submit': 'Nachricht Senden',
		'contact.email_placeholder': 'du@beispiel.de',
		'contact.message_placeholder': 'Erzähle uns von deinem Projekt...',
		'footer.text': '© 2025 Eschenbach Studio. Alle Rechte vorbehalten.',
	},
};

export function t(lang, key) {
	return translations[lang]?.[key] || translations.en[key] || key;
}
