document.addEventListener("DOMContentLoaded", () => {
	console.log("DOM loaded");
	// ADD THIS NEW BLOCK
	const navbar = document.getElementById("mainNavbar");
	const timeline = document.querySelector(".timeline-horizontal");
	const line = document.querySelector(".timeline-line");
	const dots = document.querySelectorAll(".timeline-dot");
	const items = document.querySelectorAll(".timeline-item");
	// Listen to the window's native scroll event
	window.addEventListener("scroll", () => {
		// Check if the user has scrolled more than 50px
		if (window.scrollY > 50) {
			navbar.classList.add("scrolled");
		} else {
			navbar.classList.remove("scrolled");
		}
	});
	// Hamburger Menu with Overlay
	const hamburger = document.getElementById("hamburger");
	const navLinks = document.getElementById("nav-links");
	const body = document.body;

	// Create overlay element
	const overlay = document.createElement("div");
	overlay.className = "overlay";
	body.appendChild(overlay);

	if (hamburger && navLinks) {
		// Toggle menu
		hamburger.addEventListener("click", (e) => {
			e.preventDefault();
			navLinks.classList.toggle("open");
			hamburger.classList.toggle("active");
			overlay.classList.toggle("active");
			body.classList.toggle("menu-open");
			console.log("Hamburger clicked");
		});

		// Close menu when clicking overlay
		overlay.addEventListener("click", () => {
			navLinks.classList.remove("open");
			hamburger.classList.remove("active");
			overlay.classList.remove("active");
			body.classList.remove("menu-open");
		});

		// Close menu when clicking a link
		const navLinkItems = navLinks.querySelectorAll("a");
		navLinkItems.forEach((link) => {
			link.addEventListener("click", () => {
				navLinks.classList.remove("open");
				hamburger.classList.remove("active");
				overlay.classList.remove("active");
				body.classList.remove("menu-open");
			});
		});
	} else {
		console.error("Hamburger or NavLinks element not found");
	}

	function updateProgress() {
		// Only run on mobile layout
		if (!window.matchMedia("(max-width: 768px)").matches) return;

		const timelineSection = document.querySelector("#timeline");
		const timelineRect = timelineSection.getBoundingClientRect();

		const windowHeight = window.innerHeight;

		// When section is above the bottom of screen and below the top
		if (timelineRect.top < windowHeight && timelineRect.bottom > 0) {
			// Section is in view → start progress animation
			const totalHeight = timelineRect.height;
			let visible = windowHeight - timelineRect.top; // amount scrolled in section
			visible = Math.max(0, Math.min(visible, totalHeight)); // clamp value

			const progressPercent = (visible / totalHeight) * 100;

			// Apply animated fill
			line.style.setProperty("--progress", progressPercent + "%");

			// Activate dots based on position
			items.forEach((item, index) => {
				const rect = item.getBoundingClientRect();
				if (rect.top < windowHeight * 0.6 && rect.bottom > 0) {
					dots[index].classList.add("active");
				} else {
					dots[index].classList.remove("active");
				}
			});
		} else {
			// If not in view, reset
			line.style.setProperty("--progress", "0%");
			dots.forEach((dot) => dot.classList.remove("active"));
		}
	}

	window.addEventListener("scroll", updateProgress);
	updateProgress();
});
