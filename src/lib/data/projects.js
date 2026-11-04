export const PROFILE = {
	brand: 'Eschenbach Studio',
	name: 'Linus Eschenbach',
	role: 'Full-Stack Web Development & Modern Frontend Engineering',
	email: 'linuseschenbach@gmail.com',
	github: 'https://github.com/eschencode',
	githubHandle: '@eschencode',
	location: 'Berlin / Europe'
};

/**
 * Central Hub Nodes (Category Gravity Wells in the Obsidian Graph)
 */
export const HUB_CATEGORIES = [
	{
		id: 'hub-fullstack',
		label: 'Full-Stack & Web UI',
		shortLabel: 'Web & UI',
		color: '#7ba888',
		description:
			'Modern web applications, reactive interfaces, and end-to-end product engineering with SvelteKit & TypeScript.'
	},
	{
		id: 'hub-systems',
		label: 'Systems & Engines',
		shortLabel: 'Systems',
		color: '#6b9dad',
		description:
			'Low-level systems programming in C & C++: custom HTTP servers, UNIX shells, and 3D raycasting engines.'
	},
	{
		id: 'hub-infra',
		label: 'Cloud, Auth & Infra',
		shortLabel: 'Infra & DevOps',
		color: '#d4b483',
		description:
			'Containerized Alpine stacks, authentication bridges, networking protocols, and deployment workflows.'
	},
	{
		id: 'hub-data',
		label: 'Data & Machine Learning',
		shortLabel: 'Data & ML',
		color: '#b48ead',
		description:
			'Algorithmic data pipelines, statistical modeling, and machine learning foundations in Python.'
	}
];

/**
 * Project Nodes (Populated from @eschencode GitHub repositories)
 */
export const PROJECTS = [
	{
		id: 'eschenbach-studio',
		title: 'Eschenbach Studio',
		year: '2026',
		hub: 'hub-fullstack',
		secondaryHubs: ['hub-infra'],
		relatedProjects: ['seb-eschenbach', 'sveltia-cms-auth'],
		tech: ['SvelteKit', 'Svelte 5', 'Cloudflare Workers', 'Canvas 2D'],
		summary:
			'Atmospheric scrollytelling portfolio and interactive force-directed project constellation for Eschenbach Studio.',
		githubUrl: 'https://github.com/eschencode/EschenbachStudio',
		featured: true
	},
	{
		id: 'printfarm-companion',
		title: 'PrintFarm Companion',
		year: '2026',
		hub: 'hub-fullstack',
		secondaryHubs: ['hub-data'],
		relatedProjects: ['3dprintfarm-tracker', 'anytax-assessment'],
		tech: ['Svelte', 'Full-Stack', 'Telemetry', 'Analytics'],
		summary:
			'Modern full-stack web application for managing a 3D print farm. Track printers, filament spools, print jobs, and live production statistics.',
		githubUrl: 'https://github.com/eschencode/PrintFarmCompanion',
		featured: true
	},
	{
		id: 'seb-eschenbach',
		title: 'seb.eschenbach',
		year: '2026',
		hub: 'hub-fullstack',
		secondaryHubs: [],
		relatedProjects: ['eschenbach-studio', 'sveltia-cms-auth'],
		tech: ['Svelte', 'Frontend UI', 'Responsive Design'],
		summary:
			'Bespoke web presence and editorial portfolio crafted with Svelte, focusing on typographic clarity and fluid transitions.',
		githubUrl: 'https://github.com/eschencode/seb.eschenbach',
		featured: true
	},
	{
		id: 'ft-transcendence',
		title: 'ft_transcendence',
		year: '2026',
		hub: 'hub-fullstack',
		secondaryHubs: ['hub-systems'],
		relatedProjects: ['ft-transcendence98', 'webserve'],
		tech: ['TypeScript', 'WebSockets', 'OAuth2', 'Real-Time'],
		summary:
			'Full-stack multiplayer Pong platform styled after Windows 98. Features real-time WebSocket matchmaking, live chat, OAuth2 login, and spectator mode.',
		githubUrl: 'https://github.com/eschencode/ft_transcendence',
		featured: true
	},
	{
		id: 'ft-transcendence98',
		title: 'ft_transcendence 98',
		year: '2025',
		hub: 'hub-fullstack',
		secondaryHubs: [],
		relatedProjects: ['ft-transcendence'],
		tech: ['TypeScript', 'Retro UI', 'State Sync'],
		summary:
			'Retro-engineered desktop shell interface and multiplayer game client inspired by classic 90s operating systems.',
		githubUrl: 'https://github.com/eschencode/ft_transcendence98',
		featured: false
	},
	{
		id: '3dprintfarm-tracker',
		title: '3D PrintFarm Tracker',
		year: '2026',
		hub: 'hub-fullstack',
		secondaryHubs: ['hub-data'],
		relatedProjects: ['printfarm-companion'],
		tech: ['TypeScript', 'Dashboard', 'Performance Metrics'],
		summary:
			'Streamlined 3D print farm tracker built for spool inventory management and machine performance data collection.',
		githubUrl: 'https://github.com/eschencode/3dPrintfarm_tracker',
		featured: false
	},
	{
		id: 'sveltia-cms-auth',
		title: 'Sveltia CMS Auth',
		year: '2026',
		hub: 'hub-infra',
		secondaryHubs: ['hub-fullstack'],
		relatedProjects: ['seb-eschenbach', 'eschenbach-studio'],
		tech: ['JavaScript', 'OAuth', 'Serverless', 'CMS'],
		summary:
			'Lightweight authentication bridge enabling seamless OAuth workflows for Git-backed headless CMS deployments.',
		githubUrl: 'https://github.com/eschencode/sveltia-cms-auth',
		featured: false
	},
	{
		id: 'anytax-assessment',
		title: 'AnyTax Platform',
		year: '2026',
		hub: 'hub-fullstack',
		secondaryHubs: [],
		relatedProjects: ['printfarm-companion'],
		tech: ['TypeScript', 'Web Architecture', 'UI Components'],
		summary:
			'Type-safe web application architecture demonstrating structured domain modeling and clean frontend state management.',
		githubUrl: 'https://github.com/eschencode/anytax_assiment',
		featured: false
	},
	{
		id: 'inception',
		title: 'Inception Stack',
		year: '2026',
		hub: 'hub-infra',
		secondaryHubs: ['hub-systems'],
		relatedProjects: ['webserve', 'netpractice'],
		tech: ['Docker', 'Alpine Linux', 'Nginx', 'MariaDB'],
		summary:
			'Multi-service web infrastructure built from scratch using custom Alpine Dockerfiles, TLS-hardened Nginx, WordPress, and MariaDB.',
		githubUrl: 'https://github.com/eschencode/inception',
		featured: true
	},
	{
		id: 'webserve',
		title: 'Webserve HTTP/1.1',
		year: '2026',
		hub: 'hub-systems',
		secondaryHubs: ['hub-infra'],
		relatedProjects: ['inception', 'minishell', 'netpractice'],
		tech: ['C++', 'Non-blocking I/O', 'HTTP/1.1', 'CGI'],
		summary:
			'High-concurrency, non-blocking multi-client HTTP server engineered from scratch in C++ with kqueue/epoll event loops.',
		githubUrl: 'https://github.com/eschencode/Webserve',
		featured: true
	},
	{
		id: 'minishell',
		title: 'Minishell',
		year: '2025',
		hub: 'hub-systems',
		secondaryHubs: [],
		relatedProjects: ['webserve', 'minitalk', 'packer'],
		tech: ['C', 'POSIX', 'AST Parser', 'Process Pipes'],
		summary:
			'Functional replica of the Bash UNIX shell written in C. Implements lexical parsing, pipes, redirections, signals, and file descriptor management.',
		githubUrl: 'https://github.com/eschencode/minishell',
		featured: true
	},
	{
		id: 'cube3d',
		title: 'Cube3D Raycaster',
		year: '2024',
		hub: 'hub-systems',
		secondaryHubs: [],
		relatedProjects: ['minishell', 'packer'],
		tech: ['C', 'Raycasting', 'Computer Graphics', 'Linear Algebra'],
		summary:
			'Custom 3D raycasting engine built in C. Implements DDA ray-plane intersection, textured wall projection, and real-time frame rendering.',
		githubUrl: 'https://github.com/eschencode/cube3d',
		featured: true
	},
	{
		id: 'packer',
		title: 'Binary Packer',
		year: '2026',
		hub: 'hub-systems',
		secondaryHubs: [],
		relatedProjects: ['minishell', 'cube3d'],
		tech: ['C', 'ELF Binaries', 'Memory Layout', 'Systems'],
		summary:
			'Low-level systems tool written in C for inspecting, transforming, and packing executable binary structures.',
		githubUrl: 'https://github.com/eschencode/packer',
		featured: false
	},
	{
		id: 'netpractice',
		title: 'NetPractice TCP/IP',
		year: '2024',
		hub: 'hub-infra',
		secondaryHubs: ['hub-systems'],
		relatedProjects: ['inception', 'webserve'],
		tech: ['TCP/IP', 'Subnetting', 'Routing Tables', 'OSI Model'],
		summary:
			'Network topology design and routing configuration across complex subnet masks, switches, and gateways.',
		githubUrl: 'https://github.com/eschencode/NetPractice',
		featured: false
	},
	{
		id: 'minitalk',
		title: 'Minitalk IPC',
		year: '2023',
		hub: 'hub-systems',
		secondaryHubs: [],
		relatedProjects: ['minishell'],
		tech: ['C', 'UNIX Signals', 'Bitwise IPC'],
		summary:
			'Asynchronous client-server communication protocol built in C that transmits arbitrary data streams purely via UNIX SIGUSR1/SIGUSR2 signals.',
		githubUrl: 'https://github.com/eschencode/Minitalk',
		featured: false
	},
	{
		id: '42-data-science',
		title: '42 Data Science Piscine',
		year: '2026',
		hub: 'hub-data',
		secondaryHubs: [],
		relatedProjects: ['42-linear-regression', 'python-onemonth'],
		tech: ['Python', 'Pandas', 'PostgreSQL', 'Data Pipelines'],
		summary:
			'End-to-end data engineering and exploratory analysis suite processing large behavioral datasets into actionable visual insights.',
		githubUrl: 'https://github.com/eschencode/42Data_Science_Piscine',
		featured: false
	},
	{
		id: '42-linear-regression',
		title: 'Linear Regression Engine',
		year: '2026',
		hub: 'hub-data',
		secondaryHubs: [],
		relatedProjects: ['42-data-science'],
		tech: ['Python', 'Gradient Descent', 'Machine Learning'],
		summary:
			'From-scratch implementation of supervised linear regression using gradient descent optimization, normalization, and loss visualization.',
		githubUrl: 'https://github.com/eschencode/42_linear_regression',
		featured: false
	},
	{
		id: 'python-onemonth',
		title: 'Python Explorations',
		year: '2023',
		hub: 'hub-data',
		secondaryHubs: [],
		relatedProjects: ['42-data-science'],
		tech: ['Python', 'Jupyter', 'Automation'],
		summary:
			'Collection of computational notebooks, automation scripts, and data parsing experiments in Python.',
		githubUrl: 'https://github.com/eschencode/Python_onemonth',
		featured: false
	}
];
