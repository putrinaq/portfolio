document.addEventListener("DOMContentLoaded", () => {
	console.log("DOM loaded");

	const navbar = document.getElementById("mainNavbar");

	// ── Locomotive Scroll ──────────────────────────────────────────────────────
	const scrollContainer = document.querySelector("[data-scroll-container]");
	let locomotiveScroll = null;

	if (scrollContainer && typeof LocomotiveScroll !== "undefined") {
		locomotiveScroll = new LocomotiveScroll({
			el: scrollContainer,
			smooth: true,
			lerp: 0.08,
			multiplier: 1,
			smartphone: { smooth: false },
			tablet: { smooth: false },
		});

		// Update Locomotive height after all images load
		window.addEventListener("load", () => {
			locomotiveScroll.update();
		});

		// Also update on any image load inside scroll container
		scrollContainer.querySelectorAll("img").forEach((img) => {
			img.addEventListener("load", () => locomotiveScroll.update());
		});

		locomotiveScroll.on("scroll", ({ scroll, limit }) => {
			// Navbar shrink on scroll
			if (scroll.y > 50) {
				navbar.classList.add("scrolled");
			} else {
				navbar.classList.remove("scrolled");
			}

			// Scroll progress bar
			const progressBar = document.querySelector(".scroll-progress");
			if (progressBar && limit.y > 0) {
				progressBar.style.width = (scroll.y / limit.y) * 100 + "%";
			}

			checkAllWatchers();
		});

		// ── Intercept all anchor # links → use Locomotive scrollTo ────────────
		document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
			anchor.addEventListener("click", function (e) {
				const href = this.getAttribute("href");
				if (href === "#") return; // skip brand/logo link

				const targetEl = document.querySelector(href);
				if (targetEl) {
					e.preventDefault();
					locomotiveScroll.scrollTo(targetEl, {
						offset: -80, // adjust to your navbar height
						duration: 1200,
						easing: [0.25, 0.0, 0.35, 1.0],
					});
				}
			});
		});
	}

	// ── Fallback native scroll (when Locomotive is disabled on mobile) ─────────
	window.addEventListener("scroll", () => {
		if (window.scrollY > 50) {
			navbar.classList.add("scrolled");
		} else {
			navbar.classList.remove("scrolled");
		}

		const progressBar = document.querySelector(".scroll-progress");
		if (progressBar) {
			const max = document.body.scrollHeight - window.innerHeight;
			if (max > 0) {
				progressBar.style.width = (window.scrollY / max) * 100 + "%";
			}
		}

		checkAllWatchers();
	});

	// ── Hamburger Menu ─────────────────────────────────────────────────────────
	const hamburger = document.getElementById("hamburger");
	const navLinks = document.getElementById("nav-links");
	const body = document.body;

	const overlay = document.createElement("div");
	overlay.className = "overlay";
	body.appendChild(overlay);

	function closeMenu() {
		navLinks.classList.remove("open");
		hamburger.classList.remove("active");
		hamburger.setAttribute("aria-expanded", "false");
		overlay.classList.remove("active");
		body.classList.remove("menu-open");
	}

	if (hamburger && navLinks) {
		hamburger.addEventListener("click", () => {
			const isOpen = navLinks.classList.contains("open");
			if (isOpen) {
				closeMenu();
			} else {
				navLinks.classList.add("open");
				hamburger.classList.add("active");
				hamburger.setAttribute("aria-expanded", "true");
				overlay.classList.add("active");
				body.classList.add("menu-open");
			}
		});

		overlay.addEventListener("click", closeMenu);

		// Close menu on nav link click (mobile)
		navLinks.querySelectorAll("a").forEach((link) => {
			link.addEventListener("click", closeMenu);
		});
	}

	// ── Work Experience Accordion ──────────────────────────────────────────────
	document.querySelectorAll(".work-header").forEach((header) => {
		header.addEventListener("click", () => {
			const item = header.closest(".work-item");
			const isOpen = item.classList.contains("is-open");

			// Close all open items
			document.querySelectorAll(".work-item.is-open").forEach((el) => {
				el.classList.remove("is-open");
				el.querySelector(".work-header").setAttribute("aria-expanded", "false");
			});

			// Open clicked item if it was closed
			if (!isOpen) {
				item.classList.add("is-open");
				header.setAttribute("aria-expanded", "true");

				// Tell Locomotive to recalculate height after accordion expands
				if (locomotiveScroll) {
					setTimeout(() => locomotiveScroll.update(), 350);
				}
			}
		});
	});

	// ── Custom Cursor ──────────────────────────────────────────────────────────
	const cursorDot = document.querySelector(".cursor-dot");
	const cursorRing = document.querySelector(".cursor-ring");

	if (cursorDot && cursorRing) {
		let mouseX = 0,
			mouseY = 0,
			ringX = 0,
			ringY = 0;

		document.addEventListener("mousemove", (e) => {
			mouseX = e.clientX;
			mouseY = e.clientY;
			cursorDot.style.left = mouseX + "px";
			cursorDot.style.top = mouseY + "px";
		});

		(function animateCursor() {
			ringX += (mouseX - ringX) * 0.12;
			ringY += (mouseY - ringY) * 0.12;
			cursorRing.style.left = ringX + "px";
			cursorRing.style.top = ringY + "px";
			requestAnimationFrame(animateCursor);
		})();

		document
			.querySelectorAll("a, button, .project-card, .skills-button")
			.forEach((el) => {
				el.addEventListener("mouseenter", () =>
					cursorRing.classList.add("cursor-hover"),
				);
				el.addEventListener("mouseleave", () =>
					cursorRing.classList.remove("cursor-hover"),
				);
			});

		document.addEventListener("mouseleave", () => {
			cursorDot.style.opacity = "0";
			cursorRing.style.opacity = "0";
		});

		document.addEventListener("mouseenter", () => {
			cursorDot.style.opacity = "1";
			cursorRing.style.opacity = "1";
		});
	}

	// ── Magnetic Buttons ───────────────────────────────────────────────────────
	document.querySelectorAll(".btn-cta").forEach((btn) => {
		btn.addEventListener("mousemove", (e) => {
			const rect = btn.getBoundingClientRect();
			const x = (e.clientX - rect.left - rect.width / 2) * 0.28;
			const y = (e.clientY - rect.top - rect.height / 2) * 0.28;
			btn.style.transition = "transform 0.15s ease";
			btn.style.transform = `translate(${x}px, ${y}px)`;
		});

		btn.addEventListener("mouseleave", () => {
			btn.style.transition = "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)";
			btn.style.transform = "";
			setTimeout(() => (btn.style.transition = ""), 500);
		});
	});

	// ── 3D Card Tilt ───────────────────────────────────────────────────────────
	document.querySelectorAll(".project-card").forEach((card) => {
		const TILT = 8;

		card.addEventListener("mousemove", (e) => {
			const rect = card.getBoundingClientRect();
			const x = (e.clientX - rect.left) / rect.width - 0.5;
			const y = (e.clientY - rect.top) / rect.height - 0.5;
			card.style.transform = `rotateY(${x * TILT * 2}deg) rotateX(${-y * TILT * 2}deg) scale(1.02)`;
			card.style.transition = "transform 0.1s ease";
		});

		card.addEventListener("mouseleave", () => {
			card.style.transition = "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)";
			card.style.transform = "";
		});
	});

	// ── Scroll-driven Reveal System ────────────────────────────────────────────
	// Uses getBoundingClientRect() — works correctly with Locomotive Scroll's
	// transform-based scrolling where IntersectionObserver can miss elements.

	const revealWatchers = [];

	function watchReveal(trigger, onReveal, threshold = 0.88) {
		revealWatchers.push({ trigger, onReveal, threshold, done: false });
	}

	function checkAllWatchers() {
		const vh = window.innerHeight;
		revealWatchers.forEach((w) => {
			if (w.done) return;
			const rect = w.trigger.getBoundingClientRect();
			if (rect.top < vh * w.threshold && rect.bottom > 0) {
				w.onReveal();
				w.done = true;
			}
		});
	}

	// rAF loop — runs every frame until all watchers are resolved
	(function revealLoop() {
		checkAllWatchers();
		if (revealWatchers.some((w) => !w.done)) {
			requestAnimationFrame(revealLoop);
		}
	})();

	// Stagger: children get reveal classes, parent is the scroll trigger
	function staggerReveal(parentSel, childSel, dirClass, gapMs) {
		document.querySelectorAll(parentSel).forEach((parent) => {
			const children = [...parent.querySelectorAll(childSel)];
			children.forEach((child, i) => {
				child.classList.add("reveal", dirClass);
				child.style.transitionDelay = i * gapMs + "ms";
			});
			watchReveal(parent, () =>
				children.forEach((c) => c.classList.add("is-visible")),
			);
		});
	}

	// Single: element is both trigger and target
	function singleReveal(sel, dirClass, delayMs) {
		document.querySelectorAll(sel).forEach((el) => {
			el.classList.add("reveal", dirClass);
			el.style.transitionDelay = delayMs + "ms";
			watchReveal(el, () => el.classList.add("is-visible"));
		});
	}

	// Project cards — staggered slide-up
	staggerReveal(".projects-container", ".project-card", "reveal--up", 110);

	// About — image left, content right
	singleReveal(".about-image-wrap", "reveal--left", 0);
	singleReveal(".about-content", "reveal--right", 120);

	// Work experience rows — staggered slide-up
	staggerReveal(".work-list", ".work-item", "reveal--up", 80);

	// Education rows — staggered slide-up
	staggerReveal(
		".education-details-wrapper",
		".education-details",
		"reveal--up",
		150,
	);

	// Skills buttons — staggered scale pop-in
	staggerReveal(".skills-details", ".skills-button", "reveal--scale", 45);

	// ── Kinetic Typography for .section-title ──────────────────────────────────
	function setupKineticTitle(el) {
		const chars = el.textContent.trim().split("");

		el.innerHTML = chars
			.map((char, i) => {
				if (char === " ")
					return `<span class="word-outer char-space"><span class="word-inner"> </span></span>`;
				return `<span class="word-outer"><span class="word-inner" style="transition-delay:${i * 38}ms">${char}</span></span>`;
			})
			.join("");

		watchReveal(el, () => el.classList.add("title-visible"), 0.9);
	}

	document.querySelectorAll(".section-title").forEach(setupKineticTitle);

	// ── About Me — Count-up Stats ──────────────────────────────────────────────
	const statsEl = document.querySelector(".about-stats");

	if (statsEl) {
		watchReveal(
			statsEl,
			() => {
				statsEl.querySelectorAll(".stat-number").forEach((el) => {
					const raw = el.dataset.target;
					const isDecimal = raw.includes(".");
					const target = parseFloat(raw);
					const duration = 1600;
					const startTime = performance.now();

					function tick(now) {
						const elapsed = now - startTime;
						const progress = Math.min(elapsed / duration, 1);
						const eased = 1 - Math.pow(1 - progress, 3);
						const current = target * eased;

						if (isDecimal) {
							el.textContent = current.toFixed(1);
						} else if (target >= 1000) {
							el.textContent = Math.floor(current).toLocaleString() + "+";
						} else if (target >= 100) {
							el.textContent = Math.floor(current) + "%";
						} else {
							el.textContent = Math.floor(current) + "+";
						}

						if (progress < 1) requestAnimationFrame(tick);
					}

					requestAnimationFrame(tick);
				});
			},
			0.7,
		);
	}
});
