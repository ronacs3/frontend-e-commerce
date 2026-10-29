// Inspired by EricTsai83/add-item-to-cart-animation's curved product flight.
// Each invocation owns its animation so rapid additions and unmounts are safe.
export function animateToCart({ source, image, fallbackImage }) {
  const cart = document.querySelector('[data-cart-target]');
  if (!source || !cart || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !source.animate) return () => {};
  const origin = source.getBoundingClientRect();
  const target = cart.getBoundingClientRect();
  if (!target.width || !target.height) return () => {};
  const visible = origin.bottom > 0 && origin.top < window.innerHeight;
  const x = visible ? origin.left + origin.width / 2 : window.innerWidth / 2;
  const y = visible ? origin.top + origin.height / 2 : window.innerHeight - 48;
  const dx = target.left + target.width / 2 - x;
  const dy = target.top + target.height / 2 - y;
  const node = document.createElement('span');
  node.className = 'cart-flight';
  node.setAttribute('aria-hidden', 'true');
  node.style.left = `${x}px`;
  node.style.top = `${y}px`;
  const photo = document.createElement('img');
  photo.alt = '';
  photo.src = image || fallbackImage;
  photo.onerror = () => { photo.onerror = null; photo.src = fallbackImage; };
  node.appendChild(photo);
  document.body.appendChild(node);
  // Sample a quadratic curve to preserve a smooth arc at every viewport size.
  const frames = Array.from({ length: 31 }, (_, index) => {
    const t = index / 30;
    const lift = Math.min(180, Math.max(70, Math.abs(dx) * .22));
    return {
      transform: `translate(-50%, -50%) translate(${dx * t}px, ${dy * t - 4 * lift * t * (1 - t)}px) rotate(${-16 * Math.sin(Math.PI * t)}deg) scale(${1 - .88 * t})`,
      opacity: t > .85 ? (1 - t) / .15 : 1,
      offset: t,
    };
  });
  const flight = node.animate(frames, { duration: 820, easing: 'cubic-bezier(.3,0,.2,1)', fill: 'forwards' });
  let pulse;
  const remove = () => node.remove();
  flight.oncancel = remove;
  flight.onfinish = () => {
    remove();
    if (cart.isConnected) pulse = cart.animate([
      { transform: 'scale(1)' },
      { transform: 'scale(1.24) rotate(-8deg)', backgroundColor: '#eadcc4', offset: .4 },
      { transform: 'scale(1)' },
    ], { duration: 380, easing: 'ease-out' });
  };
  return () => { flight.cancel(); pulse?.cancel(); remove(); };
}
