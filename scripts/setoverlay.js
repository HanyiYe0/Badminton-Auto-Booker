var overlay = document.createElement('div');
overlay.id = 'smsOverlay';
overlay.style.position = 'fixed';
overlay.style.top = '0';
overlay.style.left = '0';
overlay.style.width = '100vw';
overlay.style.height = '100vh';
overlay.style.backgroundColor = 'rgba(255, 255, 255, 1)';
overlay.style.zIndex = '9999999';
overlay.style.display = 'flex';
overlay.style.justifyContent = 'center';
overlay.style.alignItems = 'center';
overlay.style.fontSize = '2rem';
overlay.style.fontWeight = 'bold';
overlay.style.color = '#333';
var text = document.createElement('div');
text.textContent = 'Sending SMS...';
overlay.appendChild(text);
document.body.appendChild(overlay);

// Nuclear option: Disable animations on the page
const style = document.createElement('style');
style.id = 'animationKiller';
style.textContent = `
  * {
    animation: none !important;
    transition: none !important;
  }
`;
document.head.appendChild(style);
