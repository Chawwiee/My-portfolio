// Scrollspy for navigation highlighting
document.addEventListener('DOMContentLoaded', function () {
	const navLinks = document.querySelectorAll('.nav-link');
	const sections = Array.from(navLinks).map(link => {
		const id = link.getAttribute('href').replace('#', '');
		return document.getElementById(id);
	});

		// Improved scrollspy using scroll position
		function scrollSpyFallback() {
			let scrollPos = window.scrollY || window.pageYOffset;
			let offset = 120;
			let found = false;
			for (let i = 0; i < sections.length; i++) {
				const section = sections[i];
				if (!section) continue;
				const top = section.offsetTop - offset;
				const bottom = top + section.offsetHeight;
				if (scrollPos >= top && scrollPos < bottom) {
					navLinks.forEach((link, idx) => link.classList.toggle('active', idx === i));
					found = true;
					break;
				}
			}
			// If at the bottom of the page, highlight the last section
			if (!found && (window.innerHeight + scrollPos >= document.body.offsetHeight - 2)) {
				navLinks.forEach((link, idx) => link.classList.toggle('active', idx === sections.length - 1));
			} else if (!found) {
				navLinks.forEach((link, idx) => link.classList.toggle('active', idx === 0));
			}
		}

	// Intersection Observer for robust scrollspy
	if ('IntersectionObserver' in window) {
		const sectionMap = new Map();
		sections.forEach((section, idx) => {
			if (section) sectionMap.set(section, idx);
		});
		let currentActive = 0;
		const observer = new window.IntersectionObserver((entries) => {
			let visibleSections = entries.filter(e => e.isIntersecting);
			if (visibleSections.length > 0) {
				// Pick the section closest to the top
				visibleSections.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
				const idx = sectionMap.get(visibleSections[0].target);
				navLinks.forEach((link, i) => link.classList.toggle('active', i === idx));
				currentActive = idx;
			}
		}, {
			root: null,
			rootMargin: '-30% 0px -60% 0px',
			threshold: 0.2
		});
		sections.forEach(section => { if (section) observer.observe(section); });
		window.addEventListener('scroll', scrollSpyFallback); // fallback for edge cases
	} else {
		window.addEventListener('scroll', scrollSpyFallback);
	}

	// Smooth scroll on click
	navLinks.forEach((link, idx) => {
		link.addEventListener('click', function (e) {
			const targetId = this.getAttribute('href').replace('#', '');
			const targetSection = document.getElementById(targetId);
			if (targetSection) {
				e.preventDefault();
				window.scrollTo({
					top: targetSection.offsetTop - 80, // adjust for header height
					behavior: 'smooth'
				});
			}
		});
	});

	// Initial highlight
	navLinks.forEach((link, i) => link.classList.toggle('active', i === 0));
});

// Interactive Projects Section
function setupProjectCards() {
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    card.addEventListener('click', function() {
      cards.forEach(c => c.classList.remove('active'));
      this.classList.add('active');
    });
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        cards.forEach(c => c.classList.remove('active'));
        this.classList.add('active');
      }
    });
  });
  // Optional: close details when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.project-card')) {
      cards.forEach(c => c.classList.remove('active'));
    }
  });
}
document.addEventListener('DOMContentLoaded', setupProjectCards);

// Modal for project images
function setupImageModal() {
  const modal = document.createElement('div');
  modal.className = 'image-modal';
  modal.style.display = 'none';
  modal.innerHTML = '<div class="modal-backdrop"></div><div class="modal-content"><img src="" alt="Project Image" /><span class="modal-close">&times;</span></div>';
  document.body.appendChild(modal);

  const imgTag = modal.querySelector('img');
  const closeBtn = modal.querySelector('.modal-close');
  const backdrop = modal.querySelector('.modal-backdrop');

  function showModal(src, alt) {
    imgTag.src = src;
    imgTag.alt = alt;
    modal.style.display = 'flex';
  }
  function hideModal() {
    modal.style.display = 'none';
    imgTag.src = '';
    imgTag.alt = '';
  }
  closeBtn.addEventListener('click', hideModal);
  backdrop.addEventListener('click', hideModal);
  document.addEventListener('keydown', function(e) {
    if (modal.style.display === 'flex' && (e.key === 'Escape' || e.key === 'Esc')) hideModal();
  });

  document.querySelectorAll('.image-thumb img').forEach(img => {
    img.addEventListener('click', function() {
      showModal(this.src, this.alt);
    });
  });
}
document.addEventListener('DOMContentLoaded', setupImageModal);

// Interactive image boxes modal
function setupBoxModal() {
  const modal = document.createElement('div');
  modal.className = 'box-modal';
  modal.style.display = 'none';
  modal.innerHTML = '<div class="box-modal-content"><span class="box-modal-close">&times;</span><div class="box-modal-body"></div></div>';
  document.body.appendChild(modal);

  const closeBtn = modal.querySelector('.box-modal-close');
  const body = modal.querySelector('.box-modal-body');

  function showModal(title) {
    body.innerHTML = `<h2 style=\"margin-bottom:18px;\">${title}</h2><p>Content for <strong>${title}</strong> goes here. You can add images, text, or anything you want.</p>`;
    modal.style.display = 'flex';
  }
  function hideModal() {
    modal.style.display = 'none';
    body.innerHTML = '';
  }
  closeBtn.addEventListener('click', hideModal);
  document.addEventListener('keydown', function(e) {
    if (modal.style.display === 'flex' && (e.key === 'Escape' || e.key === 'Esc')) hideModal();
  });
  modal.addEventListener('click', function(e) {
    if (e.target === modal) hideModal();
  });

  document.querySelectorAll('.image-box').forEach(box => {
    box.addEventListener('click', function() {
      showModal(this.getAttribute('data-title'));
    });
  });
}
document.addEventListener('DOMContentLoaded', setupBoxModal);
