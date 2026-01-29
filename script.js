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

// Contact form handler: validate and submit (mailto fallback)
document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn ? submitBtn.textContent : 'Send';

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const name = (form.querySelector('#name') || {}).value || '';
    const email = (form.querySelector('#email') || {}).value || '';
    const message = (form.querySelector('#message') || {}).value || '';

    if (!name.trim() || !email.trim() || !message.trim()) {
      alert('Please fill in your name, email, and message.');
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }

    // If you have a form endpoint (recommended for GitHub Pages), set it here.
    // Example (Formspree): https://formspree.io/f/yourFormId
    // Example (Google Apps Script): https://script.google.com/macros/s/XXXXX/exec
    // Leave blank to use the mailto fallback/modal.
    // To use Formspree, set your form endpoint below (provided by Formspree)
    const FORM_ENDPOINT = 'https://formspree.io/f/xdazezbe';
    // Choose how to send to the endpoint:
    // - 'form' sends as FormData (default; works with Formspree/Getform)
    // - 'json' sends application/json (useful for Google Apps Script example below)
    const FORM_ENDPOINT_TYPE = 'form';

    try {
      if (FORM_ENDPOINT) {
        if (FORM_ENDPOINT_TYPE === 'json') {
          const payload = { name, email, message };
          const res = await fetch(FORM_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (!res.ok) {
            const errText = await res.text().catch(() => '');
            throw new Error(`HTTP ${res.status} - ${errText}`);
          }
          alert('Message sent — thank you!');
          form.reset();
        } else {
          // Use FormData for maximum compatibility with form endpoints (Formspree, Getform, etc.)
          const fd = new FormData();
          fd.append('name', name);
          fd.append('email', email);
          fd.append('message', message);
          // Include Accept header for Formspree AJAX handling (recommended)
          const headers = {};
          if (FORM_ENDPOINT.includes('formspree.io')) headers['Accept'] = 'application/json';
          const res = await fetch(FORM_ENDPOINT, { method: 'POST', body: fd, headers });
          if (!res.ok) {
            const errText = await res.text().catch(() => '');
            throw new Error(`HTTP ${res.status} - ${errText}`);
          }
          alert('Message sent — thank you!');
          form.reset();
        }
      } else {
        // mailto fallback: show a small modal with options instead of forcing navigation
        const to = 'charliearanez69@email.com';
        const subject = encodeURIComponent('Portfolio message from ' + name);
        const body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message);
        const mailtoLink = `mailto:${to}?subject=${subject}&body=${body}`;

        // create modal if needed
        let mailModal = document.getElementById('mail-modal');
        if (!mailModal) {
          mailModal = document.createElement('div');
          mailModal.id = 'mail-modal';
          mailModal.style.position = 'fixed';
          mailModal.style.left = '0';
          mailModal.style.top = '0';
          mailModal.style.right = '0';
          mailModal.style.bottom = '0';
          mailModal.style.display = 'flex';
          mailModal.style.alignItems = 'center';
          mailModal.style.justifyContent = 'center';
          mailModal.style.background = 'rgba(0,0,0,0.6)';
          mailModal.style.zIndex = '99999';

          const box = document.createElement('div');
          box.style.background = '#23232b';
          box.style.padding = '20px';
          box.style.borderRadius = '12px';
          box.style.maxWidth = '420px';
          box.style.width = '92%';
          box.style.color = '#eaf6ff';
          box.style.boxShadow = '0 8px 40px rgba(0,0,0,0.6)';

          box.innerHTML = `
            <h3 style="margin:0 0 8px 0;font-size:1.05rem">Open your mail client</h3>
            <p style="margin:0 0 12px 0;color:#cfeefb;font-size:0.95rem">Your message is ready. You can open your mail client to send it, or copy the message and paste it into your preferred mail app.</p>
            <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end">
              <a id="mail-open-link" href="#" style="background:#4f8cff;color:#071124;padding:10px 12px;border-radius:8px;text-decoration:none;font-weight:700">Open Mail Client</a>
              <button id="mail-copy-btn" style="background:transparent;border:1px solid #4f8cff;color:#4f8cff;padding:10px 12px;border-radius:8px;font-weight:700">Copy Message</button>
              <button id="mail-close-btn" style="background:#333;border:0;color:#fff;padding:10px 12px;border-radius:8px;font-weight:700">Close</button>
            </div>
            <p id="mail-copy-feedback" style="margin-top:10px;color:#8be3ff;display:none;font-size:0.9rem">Copied to clipboard</p>
          `;

          mailModal.appendChild(box);
          document.body.appendChild(mailModal);

          // wire buttons
          const openLink = document.getElementById('mail-open-link');
          const copyBtn = document.getElementById('mail-copy-btn');
          const closeBtn = document.getElementById('mail-close-btn');
          const feedback = document.getElementById('mail-copy-feedback');

          openLink.addEventListener('click', function (ev) {
            // open mailto in a new window/tab — allow user to control browser behavior
            window.open(mailtoLink, '_blank');
          });
          copyBtn.addEventListener('click', function () {
            const text = `To: ${to}\nSubject: ${decodeURIComponent(subject)}\n\n${message}`;
            navigator.clipboard && navigator.clipboard.writeText(text).then(function () {
              feedback.style.display = 'block';
              setTimeout(() => feedback.style.display = 'none', 2600);
            }).catch(function () {
              // fallback: select and copy using a textarea
              const ta = document.createElement('textarea');
              ta.value = text;
              document.body.appendChild(ta);
              ta.select();
              try { document.execCommand('copy'); feedback.style.display = 'block'; setTimeout(() => feedback.style.display = 'none', 2600); } catch (err) {}
              document.body.removeChild(ta);
            });
          });
          closeBtn.addEventListener('click', function () {
            mailModal.style.display = 'none';
          });
          mailModal.addEventListener('click', function (e) { if (e.target === mailModal) mailModal.style.display = 'none'; });
        }

        // set link and show
        const linkEl = document.getElementById('mail-open-link');
        if (linkEl) linkEl.href = mailtoLink;
        const modalEl = document.getElementById('mail-modal');
        if (modalEl) modalEl.style.display = 'flex';

        // reset form after showing modal
        form.reset();
      }
    } catch (err) {
      console.error('Contact form submit error', err);
      alert('Sorry — an error occurred while sending your message. Check the console for details.\n' + (err && err.message ? err.message : ''));
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    }
  });
});
