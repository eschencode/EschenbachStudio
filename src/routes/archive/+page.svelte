<script>
	import { onMount } from 'svelte';
	import { HUB_CATEGORIES, PROJECTS } from '$lib/data/projects.js';

	/**
	 * @typedef {Object} GraphNode
	 * @property {string} id
	 * @property {'hub' | 'project'} type
	 * @property {string} label
	 * @property {string} [shortLabel]
	 * @property {string} [description]
	 * @property {string} [year]
	 * @property {string} [hub]
	 * @property {string[]} [secondaryHubs]
	 * @property {string[]} [tech]
	 * @property {string} [summary]
	 * @property {string} [githubUrl]
	 * @property {boolean} [featured]
	 * @property {string} color
	 * @property {number} radius
	 * @property {number} x
	 * @property {number} y
	 * @property {number} vx
	 * @property {number} vy
	 * @property {number} [anchorX]
	 * @property {number} [anchorY]
	 */

	/**
	 * @typedef {Object} GraphLink
	 * @property {string} source
	 * @property {string} target
	 * @property {'primary' | 'secondary' | 'synapse'} kind
	 * @property {number} distance
	 * @property {number} strength
	 */

	/** @type {HTMLCanvasElement | null} */
	let canvasEl = $state(null);
	/** @type {HTMLDivElement | null} */
	let containerEl = $state(null);

	let activeHubFilter = $state('all');
	let searchQuery = $state('');
	/** @type {GraphNode | null} */
	let hoveredNode = $state(null);
	let tooltipPos = $state({ x: 0, y: 0 });
	let showIndexDrawer = $state(false);

	// Camera state (pan & zoom)
	let camera = $state({ x: 0, y: 0, scale: 1 });

	/** @type {GraphNode[]} */
	let nodes = [];
	/** @type {GraphLink[]} */
	let links = [];
	let width = $state(1280);
	let height = $state(800);

	// Interaction tracking to distinguish drag vs click
	let isDraggingNode = false;
	/** @type {GraphNode | null} */
	let draggedNode = null;
	let isPanning = false;
	let pointerDownPos = { x: 0, y: 0 };
	let panStartCamera = { x: 0, y: 0 };
	let pointerMovedDistance = 0;

	// Filtered list for the side drawer & node dimming
	let matchingProjectIds = $derived.by(() => {
		const q = searchQuery.trim().toLowerCase();
		const set = new Set();
		for (const p of PROJECTS) {
			const hubMatch =
				activeHubFilter === 'all' ||
				p.hub === activeHubFilter ||
				p.secondaryHubs?.includes(activeHubFilter);
			const textMatch =
				!q ||
				p.title.toLowerCase().includes(q) ||
				p.summary.toLowerCase().includes(q) ||
				p.tech.some((t) => t.toLowerCase().includes(q));
			if (hubMatch && textMatch) {
				set.add(p.id);
			}
		}
		return set;
	});

	/**
	 * @param {string | undefined} hubId
	 */
	function getHubById(hubId) {
		return HUB_CATEGORIES.find((h) => h.id === hubId);
	}

	function initGraph() {
		nodes = [];
		links = [];

		const cx = width / 2;
		const cy = height / 2;
		const hubOrbitRadius = Math.min(width, height) * 0.23;

		// 1. Create Hub Nodes arranged in a balanced quadrangle around the center
		HUB_CATEGORIES.forEach((hub, idx) => {
			const angle = (idx / HUB_CATEGORIES.length) * Math.PI * 2 - Math.PI / 4;
			const hx = cx + Math.cos(angle) * hubOrbitRadius;
			const hy = cy + Math.sin(angle) * hubOrbitRadius;
			nodes.push({
				id: hub.id,
				type: 'hub',
				label: hub.label,
				shortLabel: hub.shortLabel,
				description: hub.description,
				color: '#ffffff',
				radius: 22,
				x: hx,
				y: hy,
				vx: 0,
				vy: 0,
				anchorX: hx,
				anchorY: hy
			});
		});

		// 2. Create Project Nodes orbiting their primary hub
		PROJECTS.forEach((proj, idx) => {
			const primaryHubNode = nodes.find((n) => n.id === proj.hub);
			const angle = (idx / PROJECTS.length) * Math.PI * 2 + (idx % 3) * 0.4;
			const spread = 110 + (idx % 4) * 35;

			const px = (primaryHubNode ? primaryHubNode.x : cx) + Math.cos(angle) * spread;
			const py = (primaryHubNode ? primaryHubNode.y : cy) + Math.sin(angle) * spread;

			nodes.push({
				id: proj.id,
				type: 'project',
				label: proj.title,
				year: proj.year,
				hub: proj.hub,
				secondaryHubs: proj.secondaryHubs || [],
				tech: proj.tech,
				summary: proj.summary,
				githubUrl: proj.githubUrl,
				featured: proj.featured,
				color: '#ffffff',
				radius: proj.featured ? 10 : 7.5,
				x: px,
				y: py,
				vx: 0,
				vy: 0
			});

			// Primary Hub Link
			links.push({
				source: proj.hub,
				target: proj.id,
				kind: 'primary',
				distance: proj.featured ? 125 : 150,
				strength: 0.045
			});

			// Secondary Hub Links
			for (const secHub of proj.secondaryHubs || []) {
				links.push({
					source: secHub,
					target: proj.id,
					kind: 'secondary',
					distance: 210,
					strength: 0.015
				});
			}
		});

		// 3. Project-to-Project Synapse Links
		const addedPairs = new Set();
		for (const proj of PROJECTS) {
			for (const relId of proj.relatedProjects || []) {
				const pairKey = [proj.id, relId].sort().join('--');
				if (!addedPairs.has(pairKey)) {
					addedPairs.add(pairKey);
					links.push({
						source: proj.id,
						target: relId,
						kind: 'synapse',
						distance: 135,
						strength: 0.018
					});
				}
			}
		}
	}

	/**
	 * @param {number} sx
	 * @param {number} sy
	 */
	function screenToWorld(sx, sy) {
		return {
			x: (sx - width / 2 - camera.x) / camera.scale + width / 2,
			y: (sy - height / 2 - camera.y) / camera.scale + height / 2
		};
	}

	/**
	 * @param {number} wx
	 * @param {number} wy
	 */
	function findNodeAt(wx, wy) {
		for (let i = nodes.length - 1; i >= 0; i--) {
			const n = nodes[i];
			const hitRadius = n.radius + 8 / camera.scale;
			const dx = wx - n.x;
			const dy = wy - n.y;
			if (dx * dx + dy * dy <= hitRadius * hitRadius) {
				return n;
			}
		}
		return null;
	}

	/**
	 * @param {GraphNode} node
	 */
	function isNodeActive(node) {
		if (node.type === 'hub') {
			return activeHubFilter === 'all' || activeHubFilter === node.id;
		}
		return matchingProjectIds.has(node.id);
	}

	/**
	 * @param {string} nodeId
	 */
	function isConnectedToHovered(nodeId) {
		if (!hoveredNode) return false;
		if (hoveredNode.id === nodeId) return true;
		return links.some(
			(l) =>
				(l.source === hoveredNode?.id && l.target === nodeId) ||
				(l.target === hoveredNode?.id && l.source === nodeId)
		);
	}

	function resetCamera() {
		camera = { x: 0, y: 0, scale: 1 };
		activeHubFilter = 'all';
		searchQuery = '';
	}

	/**
	 * @param {number} factor
	 */
	function zoomBy(factor) {
		const nextScale = Math.min(2.4, Math.max(0.45, camera.scale * factor));
		camera = { ...camera, scale: nextScale };
	}

	/**
	 * @param {string} hubId
	 */
	function focusHub(hubId) {
		if (hubId === 'all') {
			activeHubFilter = 'all';
			camera = { x: 0, y: 0, scale: 1 };
			return;
		}
		activeHubFilter = activeHubFilter === hubId ? 'all' : hubId;
		if (activeHubFilter !== 'all') {
			const hubNode = nodes.find((n) => n.id === hubId);
			if (hubNode) {
				camera = {
					x: (width / 2 - hubNode.x) * 1.15,
					y: (height / 2 - hubNode.y) * 1.15,
					scale: 1.18
				};
			}
		} else {
			camera = { x: 0, y: 0, scale: 1 };
		}
	}

	/**
	 * @param {PointerEvent} e
	 */
	function handlePointerDown(e) {
		if (!canvasEl) return;
		const rect = canvasEl.getBoundingClientRect();
		const sx = e.clientX - rect.left;
		const sy = e.clientY - rect.top;
		const world = screenToWorld(sx, sy);

		pointerDownPos = { x: sx, y: sy };
		pointerMovedDistance = 0;

		const hit = findNodeAt(world.x, world.y);
		if (hit) {
			isDraggingNode = true;
			draggedNode = hit;
			hoveredNode = hit;
		} else {
			isPanning = true;
			panStartCamera = { x: camera.x, y: camera.y };
		}
	}

	/**
	 * @param {PointerEvent} e
	 */
	function handlePointerMove(e) {
		if (!canvasEl) return;
		const rect = canvasEl.getBoundingClientRect();
		const sx = e.clientX - rect.left;
		const sy = e.clientY - rect.top;

		const moveDx = sx - pointerDownPos.x;
		const moveDy = sy - pointerDownPos.y;
		pointerMovedDistance = Math.hypot(moveDx, moveDy);

		const world = screenToWorld(sx, sy);

		if (isDraggingNode && draggedNode) {
			draggedNode.x = world.x;
			draggedNode.y = world.y;
			draggedNode.vx = 0;
			draggedNode.vy = 0;
			tooltipPos = { x: e.clientX, y: e.clientY };
			return;
		}

		if (isPanning) {
			camera = {
				...camera,
				x: panStartCamera.x + moveDx,
				y: panStartCamera.y + moveDy
			};
			return;
		}

		const hit = findNodeAt(world.x, world.y);
		hoveredNode = hit;
		if (hit) {
			tooltipPos = { x: e.clientX, y: e.clientY };
		}
	}

	function handlePointerUp() {
		if (isDraggingNode && draggedNode && pointerMovedDistance < 6) {
			if (draggedNode.type === 'project' && draggedNode.githubUrl) {
				window.open(draggedNode.githubUrl, '_blank', 'noopener,noreferrer');
			} else if (draggedNode.type === 'hub') {
				focusHub(draggedNode.id);
			}
		}
		isDraggingNode = false;
		draggedNode = null;
		isPanning = false;
	}

	/**
	 * @param {WheelEvent} e
	 */
	function handleWheel(e) {
		e.preventDefault();
		const factor = e.deltaY < 0 ? 1.08 : 0.92;
		zoomBy(factor);
	}

	onMount(() => {
		if (!canvasEl) return;
		const ctx = canvasEl.getContext('2d');
		if (!ctx) return;

		/** @type {number} */
		let animId = 0;
		let time = 0;

		const ambientParticles = Array.from({ length: 55 }, () => ({
			x: Math.random() * 2000 - 400,
			y: Math.random() * 1400 - 300,
			r: Math.random() * 1.2 + 0.3,
			alpha: Math.random() * 0.25 + 0.05,
			speed: Math.random() * 0.14 + 0.03
		}));

		function resize() {
			if (!containerEl || !canvasEl || !ctx) return;
			width = containerEl.clientWidth;
			height = containerEl.clientHeight;
			const dpr = window.devicePixelRatio || 1;
			canvasEl.width = width * dpr;
			canvasEl.height = height * dpr;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			if (nodes.length === 0) {
				initGraph();
			}
		}

		resize();
		window.addEventListener('resize', resize);

		/** @type {Map<string, GraphNode>} */
		const nodeMap = new Map();

		function stepPhysics() {
			nodeMap.clear();
			for (const n of nodes) nodeMap.set(n.id, n);

			for (let i = 0; i < nodes.length; i++) {
				const a = nodes[i];
				for (let j = i + 1; j < nodes.length; j++) {
					const b = nodes[j];
					let dx = b.x - a.x;
					let dy = b.y - a.y;
					let distSq = dx * dx + dy * dy;
					if (distSq < 1) distSq = 1;
					const dist = Math.sqrt(distSq);
					const minDist = a.radius + b.radius + 42;

					const repulseStrength = a.type === 'hub' && b.type === 'hub' ? 4200 : 1350;
					let force = repulseStrength / distSq;
					if (dist < minDist) {
						force += (minDist - dist) * 0.08;
					}

					const fx = (dx / dist) * force;
					const fy = (dy / dist) * force;

					if (a !== draggedNode) {
						a.vx -= fx;
						a.vy -= fy;
					}
					if (b !== draggedNode) {
						b.vx += fx;
						b.vy += fy;
					}
				}
			}

			for (const link of links) {
				const source = nodeMap.get(link.source);
				const target = nodeMap.get(link.target);
				if (!source || !target) continue;

				const dx = target.x - source.x;
				const dy = target.y - source.y;
				const dist = Math.sqrt(dx * dx + dy * dy) || 1;
				const displacement = dist - link.distance;
				const force = displacement * link.strength;

				const fx = (dx / dist) * force;
				const fy = (dy / dist) * force;

				if (source !== draggedNode) {
					source.vx += fx * (source.type === 'hub' ? 0.25 : 1);
					source.vy += fy * (source.type === 'hub' ? 0.25 : 1);
				}
				if (target !== draggedNode) {
					target.vx -= fx;
					target.vy -= fy;
				}
			}

			const cx = width / 2;
			const cy = height / 2;
			for (const n of nodes) {
				if (n === draggedNode) continue;

				if (n.type === 'hub' && n.anchorX !== undefined && n.anchorY !== undefined) {
					n.vx += (n.anchorX - n.x) * 0.035;
					n.vy += (n.anchorY - n.y) * 0.035;
				} else {
					n.vx += (cx - n.x) * 0.0015;
					n.vy += (cy - n.y) * 0.0015;
					n.vx += Math.sin(time * 0.015 + n.x * 0.01) * 0.018;
					n.vy += Math.cos(time * 0.015 + n.y * 0.01) * 0.018;
				}

				n.vx *= 0.84;
				n.vy *= 0.84;
				n.x += n.vx;
				n.y += n.vy;
			}
		}

		function render() {
			if (!ctx) return;
			time += 1;
			stepPhysics();

			ctx.clearRect(0, 0, width, height);

			ctx.save();
			ctx.translate(width / 2 + camera.x, height / 2 + camera.y);
			ctx.scale(camera.scale, camera.scale);
			ctx.translate(-width / 2, -height / 2);

			// Ambient particles
			for (const p of ambientParticles) {
				p.y -= p.speed;
				if (p.y < -300) p.y = height + 300;
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
				ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
				ctx.fill();
			}

			// Draw links
			for (const link of links) {
				const source = nodeMap.get(link.source);
				const target = nodeMap.get(link.target);
				if (!source || !target) continue;

				const currentHovered = hoveredNode;
				const isHighlighted =
					currentHovered !== null &&
					(currentHovered.id === source.id || currentHovered.id === target.id);
				const bothActive = isNodeActive(source) && isNodeActive(target);

				ctx.beginPath();
				ctx.moveTo(source.x, source.y);
				ctx.lineTo(target.x, target.y);

				if (isHighlighted) {
					ctx.strokeStyle = '#ffffff';
					ctx.lineWidth = 1.8;
					ctx.globalAlpha = 0.9;
				} else if (!bothActive) {
					ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
					ctx.lineWidth = 0.8;
					ctx.globalAlpha = 0.15;
				} else if (link.kind === 'primary') {
					ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
					ctx.lineWidth = 1.1;
					ctx.globalAlpha = currentHovered ? 0.16 : 0.35;
				} else {
					ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
					ctx.lineWidth = 0.8;
					ctx.setLineDash([4, 5]);
					ctx.globalAlpha = currentHovered ? 0.1 : 0.22;
				}

				ctx.stroke();
				ctx.setLineDash([]);

				if (isHighlighted) {
					const pulseT = (time * 0.018) % 1;
					const px = source.x + (target.x - source.x) * pulseT;
					const py = source.y + (target.y - source.y) * pulseT;
					ctx.beginPath();
					ctx.arc(px, py, 2.5, 0, Math.PI * 2);
					ctx.fillStyle = '#ffffff';
					ctx.globalAlpha = 1;
					ctx.fill();
				}
			}

			// Draw nodes
			for (const node of nodes) {
				const active = isNodeActive(node);
				const currentHovered = hoveredNode;
				const isHovered = currentHovered !== null && currentHovered.id === node.id;
				const isNeighbor = isConnectedToHovered(node.id);

				let alpha = 1;
				if (!active) alpha = 0.15;
				else if (currentHovered && !isHovered && !isNeighbor) alpha = 0.25;

				ctx.globalAlpha = alpha;

				if (node.type === 'hub') {
					ctx.beginPath();
					ctx.arc(node.x, node.y, node.radius * 2.2, 0, Math.PI * 2);
					ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
					ctx.fill();

					ctx.beginPath();
					ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
					ctx.fillStyle = '#000000';
					ctx.fill();
					ctx.lineWidth = isHovered ? 2.5 : 1.5;
					ctx.strokeStyle = '#ffffff';
					ctx.stroke();

					ctx.beginPath();
					ctx.arc(node.x, node.y, 5, 0, Math.PI * 2);
					ctx.fillStyle = '#ffffff';
					ctx.fill();

					ctx.font = "500 12px 'JetBrains Mono', monospace";
					ctx.textAlign = 'center';
					ctx.fillStyle = '#ffffff';
					ctx.fillText(node.label.toUpperCase(), node.x, node.y + node.radius + 18);
				} else {
					if (isHovered || node.featured) {
						ctx.beginPath();
						ctx.arc(
							node.x,
							node.y,
							node.radius + (isHovered ? 8 : 4),
							0,
							Math.PI * 2
						);
						ctx.fillStyle = isHovered
							? 'rgba(255, 255, 255, 0.25)'
							: 'rgba(255, 255, 255, 0.1)';
						ctx.fill();
					}

					ctx.beginPath();
					ctx.arc(node.x, node.y, isHovered ? node.radius + 2 : node.radius, 0, Math.PI * 2);
					ctx.fillStyle = '#ffffff';
					ctx.fill();

					ctx.lineWidth = 1.5;
					ctx.strokeStyle = '#000000';
					ctx.stroke();

					ctx.font = isHovered
						? "500 13px 'Inter', sans-serif"
						: "400 11.5px 'Inter', sans-serif";
					ctx.textAlign = 'center';
					ctx.fillStyle = isHovered ? '#ffffff' : 'rgba(255, 255, 255, 0.8)';
					ctx.fillText(node.label, node.x, node.y + node.radius + 15);
				}
			}

			ctx.restore();
			animId = requestAnimationFrame(render);
		}

		animId = requestAnimationFrame(render);

		return () => {
			cancelAnimationFrame(animId);
			window.removeEventListener('resize', resize);
		};
	});
</script>

<svelte:head>
	<title>Project Constellation — Eschenbach Studio</title>
</svelte:head>

<div class="archive-viewport" bind:this={containerEl}>
	<!-- Top Control Bar: Back Link, Filter Pills & Search -->
	<section class="graph-hud-top" aria-label="Graph controls and filters">
		<div class="hud-left">
			<a href="/" class="back-link">← Back to Portfolio</a>
			<div class="hud-title-row">
				<span class="hud-eyebrow">ARCHIVE // {PROJECTS.length} REPOSITORIES</span>
				<h1>Project Constellation</h1>
			</div>
			<p class="hud-hint">
				Drag nodes to rearrange · Hover to inspect · Click any project node to open on GitHub (<code
					>@eschencode</code
				>)
			</p>
		</div>

		<div class="hud-controls">
			<div class="filter-pills" role="tablist" aria-label="Filter by discipline">
				<button
					type="button"
					class="pill"
					class:active={activeHubFilter === 'all'}
					onclick={() => focusHub('all')}
				>
					All ({PROJECTS.length})
				</button>
				{#each HUB_CATEGORIES as hub}
					<button
						type="button"
						class="pill"
						class:active={activeHubFilter === hub.id}
						onclick={() => focusHub(hub.id)}
					>
						<span>{hub.shortLabel}</span>
					</button>
				{/each}
			</div>

			<div class="search-and-tools">
				<input
					type="search"
					class="search-input"
					placeholder="Filter by tech or title (e.g. Svelte, C++, Docker)..."
					bind:value={searchQuery}
				/>
				<button
					type="button"
					class="tool-btn"
					onclick={() => (showIndexDrawer = !showIndexDrawer)}
				>
					{showIndexDrawer ? 'Hide Index' : 'List View'}
				</button>
			</div>
		</div>
	</section>

	<!-- Interactive Force-Directed Canvas -->
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<canvas
		bind:this={canvasEl}
		class="graph-canvas"
		class:hovering={!!hoveredNode}
		onpointerdown={handlePointerDown}
		onpointermove={handlePointerMove}
		onpointerup={handlePointerUp}
		onwheel={handleWheel}
		aria-label="Interactive force-directed project graph"
	></canvas>

	<!-- Hover Tooltip Preview Card -->
	{#if hoveredNode}
		<div
			class="node-tooltip"
			style="left: {Math.min(width - 340, Math.max(20, tooltipPos.x + 18))}px; top: {Math.min(
				height - 230,
				Math.max(90, tooltipPos.y - 20)
			)}px;"
		>
			{#if hoveredNode.type === 'project'}
				{@const hubInfo = getHubById(hoveredNode.hub)}
				<div class="tooltip-top">
					<span class="tooltip-hub">
						● {hubInfo?.shortLabel || 'Project'}
					</span>
					<span class="tooltip-year">{hoveredNode.year}</span>
				</div>
				<h3 class="tooltip-title">{hoveredNode.label}</h3>
				<p class="tooltip-summary">{hoveredNode.summary}</p>
				<div class="tooltip-tags">
					{#each hoveredNode.tech || [] as tag}
						<span>{tag}</span>
					{/each}
				</div>
				<div class="tooltip-cta">
					<span>Click node to open repository on GitHub</span>
					<span>↗</span>
				</div>
			{:else}
				<div class="tooltip-top">
					<span class="tooltip-hub">◆ GRAVITY HUB</span>
				</div>
				<h3 class="tooltip-title">{hoveredNode.label}</h3>
				<p class="tooltip-summary">{hoveredNode.description}</p>
				<div class="tooltip-cta">
					<span>Click hub to isolate cluster</span>
					<span>◎</span>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Bottom Zoom / Reset Dock -->
	<div class="graph-hud-bottom">
		<div class="zoom-controls">
			<button type="button" onclick={() => zoomBy(1.18)} title="Zoom In">+</button>
			<button type="button" onclick={() => zoomBy(0.84)} title="Zoom Out">−</button>
			<button type="button" onclick={resetCamera} class="reset-btn">Reset View</button>
		</div>
	</div>

	<!-- Optional Slide-Over Accessible Repository Index Drawer -->
	{#if showIndexDrawer}
		<aside class="index-drawer" aria-label="Full repository directory">
			<div class="drawer-header">
				<div>
					<span class="hud-eyebrow">DIRECTORY</span>
					<h2>All Repositories ({matchingProjectIds.size})</h2>
				</div>
				<button type="button" class="close-drawer" onclick={() => (showIndexDrawer = false)}>
					✕
				</button>
			</div>

			<div class="drawer-list">
				{#each PROJECTS.filter((p) => matchingProjectIds.has(p.id)) as proj}
					<a
						href={proj.githubUrl}
						target="_blank"
						rel="noopener noreferrer"
						class="drawer-item"
					>
						<div class="drawer-item-top">
							<span class="drawer-item-title">{proj.title}</span>
							<span class="drawer-item-year">{proj.year} ↗</span>
						</div>
						<p>{proj.summary}</p>
						<div class="drawer-tags">
							{#each proj.tech as t}
								<span>{t}</span>
							{/each}
						</div>
					</a>
				{/each}
			</div>
		</aside>
	{/if}
</div>

<style>
	.archive-viewport {
		position: relative;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background: #000000;
		user-select: none;
	}

	.graph-canvas {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		cursor: grab;
	}

	.graph-canvas:active {
		cursor: grabbing;
	}

	.graph-canvas.hovering {
		cursor: pointer;
	}

	/* Top HUD */
	.graph-hud-top {
		position: absolute;
		top: 2rem;
		left: 50%;
		transform: translateX(-50%);
		z-index: 30;
		width: min(94vw, 1240px);
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 1.25rem;
		pointer-events: none;
	}

	.hud-left,
	.hud-controls {
		pointer-events: auto;
	}

	.back-link {
		display: inline-block;
		font-family: var(--font-mono);
		font-size: 0.76rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: #ffffff;
		border: 1px solid rgba(255, 255, 255, 0.25);
		background: rgba(0, 0, 0, 0.8);
		padding: 0.45rem 0.9rem;
		margin-bottom: 1rem;
		transition: all 0.2s ease;
	}

	.back-link:hover {
		background: #ffffff;
		color: #000000;
	}

	.hud-eyebrow {
		display: block;
		font-family: var(--font-mono);
		font-size: 0.66rem;
		letter-spacing: 0.16em;
		color: var(--text-sage);
		margin-bottom: 0.2rem;
	}

	.hud-title-row h1 {
		font-family: var(--font-serif);
		font-weight: 300;
		font-size: clamp(1.85rem, 2.8vw, 2.5rem);
		line-height: 1.1;
		color: #ffffff;
	}

	.hud-hint {
		font-size: 0.78rem;
		color: var(--text-sage);
		margin-top: 0.25rem;
	}

	.hud-hint code {
		font-family: var(--font-mono);
		color: #ffffff;
	}

	.hud-controls {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.65rem;
	}

	.filter-pills {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
		background: rgba(0, 0, 0, 0.85);
		padding: 0.35rem;
		border: 1px solid rgba(255, 255, 255, 0.16);
	}

	.pill {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.4rem 0.85rem;
		border: none;
		background: transparent;
		color: var(--text-mist);
		font-family: var(--font-mono);
		font-size: 0.72rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.pill:hover {
		color: #ffffff;
	}

	.pill.active {
		background: #ffffff;
		color: #000000;
	}

	.search-and-tools {
		display: flex;
		gap: 0.5rem;
		align-items: center;
	}

	.search-input {
		width: 260px;
		padding: 0.5rem 0.85rem;
		border: 1px solid rgba(255, 255, 255, 0.2);
		background: rgba(0, 0, 0, 0.85);
		color: #ffffff;
		font-family: var(--font-sans);
		font-size: 0.78rem;
	}

	.search-input:focus {
		outline: none;
		border-color: #ffffff;
	}

	.tool-btn {
		padding: 0.5rem 0.95rem;
		border: 1px solid rgba(255, 255, 255, 0.25);
		background: #000000;
		color: #ffffff;
		font-family: var(--font-mono);
		font-size: 0.72rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.tool-btn:hover {
		background: #ffffff;
		color: #000000;
	}

	/* Floating Hover Tooltip */
	.node-tooltip {
		position: fixed;
		z-index: 60;
		width: 310px;
		background: rgba(0, 0, 0, 0.94);
		border: 1px solid rgba(255, 255, 255, 0.35);
		padding: 1.15rem 1.25rem;
		box-shadow: 0 20px 50px rgba(0, 0, 0, 0.9);
		pointer-events: none;
	}

	.tooltip-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-family: var(--font-mono);
		font-size: 0.66rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--text-mist);
		margin-bottom: 0.4rem;
	}

	.tooltip-year {
		color: var(--text-sage);
	}

	.tooltip-title {
		font-family: var(--font-serif);
		font-size: 1.4rem;
		font-weight: 400;
		color: #ffffff;
		margin-bottom: 0.4rem;
	}

	.tooltip-summary {
		font-size: 0.8rem;
		line-height: 1.55;
		color: var(--text-mist);
		margin-bottom: 0.85rem;
	}

	.tooltip-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
		margin-bottom: 0.85rem;
	}

	.tooltip-tags span {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		padding: 0.18rem 0.5rem;
		border: 1px solid rgba(255, 255, 255, 0.22);
		color: #ffffff;
	}

	.tooltip-cta {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-top: 0.65rem;
		border-top: 1px solid rgba(255, 255, 255, 0.14);
		font-family: var(--font-mono);
		font-size: 0.66rem;
		color: #ffffff;
	}

	/* Bottom HUD */
	.graph-hud-bottom {
		position: absolute;
		bottom: 1.5rem;
		right: 2rem;
		z-index: 30;
		pointer-events: none;
	}

	.zoom-controls {
		pointer-events: auto;
		display: flex;
		align-items: center;
		gap: 0.35rem;
		background: rgba(0, 0, 0, 0.85);
		padding: 0.35rem;
		border: 1px solid rgba(255, 255, 255, 0.18);
	}

	.zoom-controls button {
		background: transparent;
		border: none;
		color: var(--text-mist);
		font-family: var(--font-mono);
		font-size: 0.78rem;
		padding: 0.4rem 0.75rem;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.zoom-controls button:hover {
		color: #000000;
		background: #ffffff;
	}

	/* Accessible Slide-over Drawer */
	.index-drawer {
		position: absolute;
		top: 2rem;
		right: 1.5rem;
		bottom: 5rem;
		width: min(390px, 90vw);
		z-index: 50;
		background: rgba(0, 0, 0, 0.95);
		border: 1px solid rgba(255, 255, 255, 0.22);
		padding: 1.5rem;
		display: flex;
		flex-direction: column;
		box-shadow: 0 24px 60px rgba(0, 0, 0, 0.9);
	}

	.drawer-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		padding-bottom: 1rem;
		border-bottom: 1px solid rgba(255, 255, 255, 0.14);
		margin-bottom: 1rem;
	}

	.drawer-header h2 {
		font-family: var(--font-serif);
		font-weight: 400;
		font-size: 1.45rem;
	}

	.close-drawer {
		background: transparent;
		border: none;
		color: var(--text-sage);
		font-size: 1rem;
		cursor: pointer;
	}

	.drawer-list {
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		padding-right: 0.25rem;
	}

	.drawer-item {
		padding: 1rem;
		background: #060606;
		border: 1px solid rgba(255, 255, 255, 0.14);
		transition: border-color 0.2s ease;
	}

	.drawer-item:hover {
		border-color: #ffffff;
	}

	.drawer-item-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.35rem;
	}

	.drawer-item-title {
		font-weight: 500;
		font-size: 0.92rem;
		color: #ffffff;
	}

	.drawer-item-year {
		font-family: var(--font-mono);
		font-size: 0.68rem;
		color: var(--text-sage);
	}

	.drawer-item p {
		font-size: 0.78rem;
		color: var(--text-mist);
		margin-bottom: 0.6rem;
	}

	.drawer-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.35rem;
	}

	.drawer-tags span {
		font-family: var(--font-mono);
		font-size: 0.6rem;
		color: var(--text-sage);
	}

	@media (max-width: 860px) {
		.hud-controls {
			align-items: flex-start;
		}

		.search-input {
			width: 190px;
		}
	}
</style>
