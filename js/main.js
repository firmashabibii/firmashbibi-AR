document.addEventListener('DOMContentLoaded', () => {
    
    // === 1. INISIALISASI ELEMEN UI ===
    const customMarker = document.getElementById('custom-marker');
    const statusBar = document.getElementById('status-bar');
    const statusText = document.getElementById('status-text');

    if (!customMarker || !statusBar || !statusText) {
        console.error('Inisialisasi Gagal: Beberapa elemen UI tidak ditemukan.');
        return;
    }

    let lostTimeout = null;
    let isVisualActive = false;

    // === 2. EVENT DETEKSI MARKER (MARKER FOUND) ===
    customMarker.addEventListener('markerFound', () => {
        if (lostTimeout) {
            clearTimeout(lostTimeout);
            lostTimeout = null;
        }

        statusBar.classList.remove('status-searching');
        statusBar.classList.add('status-found');
        statusText.innerText = 'Marker Terdeteksi! Objek AR aktif';

        if (!isVisualActive) {
            isVisualActive = true;
            const entranceElements = document.querySelectorAll('.entrance-element');
            entranceElements.forEach((element, index) => {
                if (element.entranceTimeout) {
                    clearTimeout(element.entranceTimeout);
                }
                element.setAttribute('scale', '0 0 0');
                element.entranceTimeout = setTimeout(() => {
                    element.emit('show-element');
                }, index * 150);
            });
        }
    });

    // === 3. EVENT KEHILANGAN MARKER (MARKER LOST) ===
    customMarker.addEventListener('markerLost', () => {
        if (lostTimeout) {
            clearTimeout(lostTimeout);
        }

        lostTimeout = setTimeout(() => {
            isVisualActive = false;

            statusBar.classList.remove('status-found');
            statusBar.classList.add('status-searching');
            statusText.innerText = 'Mencari marker...';

            const entranceElements = document.querySelectorAll('.entrance-element');
            entranceElements.forEach(element => {
                if (element.entranceTimeout) {
                    clearTimeout(element.entranceTimeout);
                }
                element.setAttribute('scale', '0 0 0');
            });
            
            lostTimeout = null;
        }, 1200);
    });

    // === 4. INTERAKSI KLIK TOMBOL TAUTAN (CLICKABLE) ===
    const clickables = document.querySelectorAll('.clickable');
    clickables.forEach(element => {
        element.addEventListener('click', (event) => {
            const url = event.currentTarget.getAttribute('data-url') || event.target.getAttribute('data-url');
            if (url) {
                window.open(url, '_blank');
            }
        });
    });

    // === 5. HOVER TOOLTIP & FEEDBACK KURSOR HTML ===
    const tooltipsMapping = [
        { buttonId: 'btn-portfolio', tooltipId: 'tooltip-portfolio' },
        { buttonId: 'btn-github', tooltipId: 'tooltip-github' },
        { buttonId: 'btn-instagram', tooltipId: 'tooltip-instagram' }
    ];

    tooltipsMapping.forEach(mapping => {
        const buttonEl = document.getElementById(mapping.buttonId);
        const tooltipEl = document.getElementById(mapping.tooltipId);

        if (buttonEl && tooltipEl) {
            buttonEl.addEventListener('mouseenter', () => {
                tooltipEl.emit('show-tooltip');
                
                const cssCursor = document.getElementById('css-cursor');
                if (cssCursor) {
                    cssCursor.style.borderColor = '#10b981';
                    cssCursor.style.width = '26px';
                    cssCursor.style.height = '26px';
                    cssCursor.style.boxShadow = '0 0 12px rgba(16, 185, 129, 0.7)';
                }
            });

            buttonEl.addEventListener('mouseleave', () => {
                tooltipEl.emit('hide-tooltip');
                
                const cssCursor = document.getElementById('css-cursor');
                if (cssCursor) {
                    cssCursor.style.borderColor = 'rgba(255, 255, 255, 0.8)';
                    cssCursor.style.width = '18px';
                    cssCursor.style.height = '18px';
                    cssCursor.style.boxShadow = '0 0 8px rgba(255, 255, 255, 0.5)';
                }
            });
        }
    });
});
