const WA_NUMBER = '254723536755';

// CAROUSEL
let currentSlide = 0;
const totalSlides = 20;
let autoTimer;

function goSlide(n) {
  currentSlide = ((n % totalSlides) + totalSlides) % totalSlides;
  const track = document.getElementById('carouselTrack');
  const wrap  = document.getElementById('heroCarousel');
  if (!track || !wrap) return;

  const slideWidth = wrap.offsetWidth;
  track.style.transform = `translateX(-${currentSlide * slideWidth}px)`;

  document.querySelectorAll('.cdot').forEach((d, i) => {
    d.classList.toggle('active', i === currentSlide);
  });
  resetAuto();
}

function nextSlide() { goSlide(currentSlide + 1); }
function prevSlide() { goSlide(currentSlide - 1); }

function resetAuto() {
  clearInterval(autoTimer);
  autoTimer = setInterval(nextSlide, 4500);
}

// Recalculate on resize so slides never drift
window.addEventListener('resize', () => { goSlide(currentSlide); });

// MOBILE MENU
function toggleMenu() {
  const menu   = document.getElementById('mobileMenu');
  const burger = document.getElementById('hamburger');
  if (!menu) return;
  menu.classList.toggle('open');
  if (burger) burger.classList.toggle('active');
}

// REVEAL ON SCROLL
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => observer.observe(el));
}

// PLAYER FILTER
function filterPlayers(pos, btn) {
  document.querySelectorAll('.ftab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.player-card').forEach(card => {
    const show = pos === 'all' || card.dataset.pos === pos;
    card.classList.toggle('hidden', !show);
  });
}

// FAQ TOGGLE
function toggleFaq(btn) {
  const item   = btn.closest('.faq-item');
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// SPONSOR MODAL
function openSponsorModal() {
  const modal = document.getElementById('sponsorModal');
  if (modal) modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeSponsorModal(e) {
  if (e && e.target !== document.getElementById('sponsorModal')) return;
  const modal = document.getElementById('sponsorModal');
  if (modal) modal.classList.remove('open');
  document.body.style.overflow = '';
}

function submitSponsorForm(e) {
  e.preventDefault();

  const name  = (document.getElementById('sp-name')    || {}).value  || '';
  const org   = (document.getElementById('sp-org')     || {}).value  || '';
  const email = (document.getElementById('sp-email')   || {}).value  || '';
  const phone = (document.getElementById('sp-phone')   || {}).value  || '';
  const level = (document.getElementById('sp-level')   || {}).value  || '';
  const msg   = (document.getElementById('sp-message') || {}).value  || '';

  const levelLabels = {
    Platinum:     'Title Sponsor — Premier visibility & branding',
    gold:      'Gold Sponsor — Kit & ground signage',
    Silver: 'Silver Sponsor — Digital Media partner, featured posts, local activation events',
    Community:    'Contribution towards community programs, recognition online',
    Gaming: 'Training equipments provider, exclusive Training content',
    Health: 'Cover player, Insurance',
    Hydration: 'Branding on water bottle, energy drinks',
    Travel: 'Hospitality provider for trips. Travel digital content'
  };

  const text = encodeURIComponent(
    `*SPONSORSHIP ENQUIRY — Karura Community FC*\n` +
    `${'─'.repeat(30)}\n\n` +
    `*Name:*              ${name}\n` +
    `*Organisation:*      ${org}\n` +
    `*Email:*             ${email}\n` +
    `*Phone:*             ${phone || 'Not provided'}\n` +
    `*Sponsorship Level:* ${levelLabels[level] || level || 'Not selected'}\n\n` +
    `*MESSAGE:*\n${msg || 'No message provided.'}\n\n` +
    `${'─'.repeat(30)}\n` +
    `_Sent via Karura Community FC sponsorship form_`
  );

  // Open WhatsApp with prefilled message
  window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, '_blank');

  // Show the success state in the modal
  const form    = document.querySelector('.modal-form');
  const success = document.getElementById('modalSuccess');
  if (form)    form.style.display = 'none';
  if (success) success.classList.add('show');
}

// CONTACT FORM
function submitForm() {
  const name    = document.querySelector('.contact-form input[placeholder="Your Name"]');
  const emailEl = document.querySelector('.contact-form input[type="email"]');
  const subject = document.querySelector('.contact-form input[placeholder="Subject"]');
  const message = document.querySelector('.contact-form textarea');

  const nameVal    = (name    || {}).value || '';
  const emailVal   = (emailEl || {}).value || '';
  const subjectVal = (subject || {}).value || '';
  const messageVal = (message || {}).value || '';

  // Basic validation
  if (!nameVal.trim() || !emailVal.trim() || !messageVal.trim()) {
    showContactError('Please fill in your name, email and message before sending.');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
    showContactError('Please enter a valid email address.');
    return;
  }

  const text = encodeURIComponent(
    `*MESSAGE — Karura Community FC Website*\n` +
    `${'─'.repeat(30)}\n\n` +
    `*From:*    ${nameVal}\n` +
    `*Email:*   ${emailVal}\n` +
    `*Subject:* ${subjectVal || '(none)'}\n\n` +
    `*MESSAGE:*\n${messageVal}\n\n` +
    `${'─'.repeat(30)}\n` +
    `_Sent via Karura Community FC contact form_`
  );

  // Open WhatsApp with prefilled message
  window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, '_blank');

  // Clear the form and show a thank-you note
  if (name)    name.value    = '';
  if (emailEl) emailEl.value = '';
  if (subject) subject.value = '';
  if (message) message.value = '';
  showContactSuccess();
}

function showContactError(msg) {
  let el = document.getElementById('contactFeedback');
  if (!el) {
    el = document.createElement('div');
    el.id = 'contactFeedback';
    el.style.cssText = 'margin-top:0.75rem;padding:0.8rem 1rem;border-radius:6px;font-size:0.88rem;font-family:Barlow,sans-serif;';
    const btn = document.querySelector('.contact-form .btn-primary');
    if (btn) btn.insertAdjacentElement('afterend', el);
  }
  el.style.background = 'rgba(192,57,43,0.15)';
  el.style.border     = '1px solid rgba(192,57,43,0.4)';
  el.style.color      = '#e74c3c';
  el.textContent      = msg;
}

function showContactSuccess() {
  let el = document.getElementById('contactFeedback');
  if (!el) {
    el = document.createElement('div');
    el.id = 'contactFeedback';
    el.style.cssText = 'margin-top:0.75rem;padding:0.8rem 1rem;border-radius:6px;font-size:0.88rem;font-family:Barlow,sans-serif;';
    const btn = document.querySelector('.contact-form .btn-primary');
    if (btn) btn.insertAdjacentElement('afterend', el);
  }
  el.style.background = 'rgba(0,166,81,0.12)';
  el.style.border     = '1px solid rgba(0,166,81,0.4)';
  el.style.color      = '#39d97a';
  el.textContent      = '✓ WhatsApp has opened with your message ready to send!';
  setTimeout(() => { if (el) el.textContent = ''; }, 8000);
}

// NAV SCROLL EFFECT
function initNav() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.style.background = window.scrollY > 40
      ? 'rgba(6,9,6,0.98)'
      : 'rgba(6,9,6,0.92)';
  }, { passive: true });
}

// BROKEN IMAGE FALLBACK
function initImageFallbacks() {
  document.querySelectorAll('img').forEach(img => {
    if (img.complete && img.naturalWidth === 0) img.classList.add('error');
    img.addEventListener('error', () => img.classList.add('error'));
  });
}

// INIT
document.addEventListener('DOMContentLoaded', () => {
  initReveal();
  initNav();
  initImageFallbacks();
  setTimeout(() => {
    goSlide(0);
    resetAuto();
  }, 100);
});