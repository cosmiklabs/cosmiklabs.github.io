// Optional page-local override. System remains the default; nothing is stored.
const control = document.querySelector('.motion-preference');
if (control) {
  const select = control.querySelector('select');
  select.addEventListener('change', () => {
    const value = ['system', 'reduce', 'full'].includes(select.value) ? select.value : 'system';
    document.documentElement.setAttribute('data-motion', value);
  });
  control.hidden = false;
}
