async function loadComponent(elementId, componentPath) {
  try {
    const response = await fetch(componentPath);
    const html = await response.text();
    document.getElementById(elementId).innerHTML = html;
  } catch (error) {
    console.error(`${componentPath}:`, error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadComponent('header-component', '/components/header.html');
  loadComponent('footer-component', '/components/footer.html');
  loadComponent('emdev-component', '/components/emdev.html');
});
