(() => {
  'use strict';

  const button = document.getElementById('nearbyBtn');
  const status = document.getElementById('v21NearbyStatus');

  if (!button || !status) return;

  const originalLabel = button.textContent;

  function showStatus(message, linkUrl) {
    status.replaceChildren(document.createTextNode(message));
    if (linkUrl) {
      const link = document.createElement('a');
      link.href = linkUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = ' Open nearby places in Google Maps';
      status.appendChild(link);
    }
  }

  button.addEventListener('click', () => {
    if (!navigator.geolocation) {
      showStatus('Location is not supported by this browser.');
      return;
    }

    // Open a tab during the user gesture so the browser does not block
    // the Maps page after the asynchronous location permission prompt.
    const mapsTab = window.open('about:blank', '_blank');

    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    button.textContent = 'Finding your location…';
    showStatus('Requesting your location. It is used only to open Google Maps.');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = Number(position.coords.latitude);
        const longitude = Number(position.coords.longitude);

        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
          if (mapsTab && !mapsTab.closed) mapsTab.close();
          showStatus('Your browser returned an invalid location. Please try again.');
          button.disabled = false;
          button.removeAttribute('aria-busy');
          button.textContent = originalLabel;
          return;
        }

        const mapsUrl = `https://www.google.com/maps/search/nearby+places/@${latitude},${longitude},15z`;

        if (mapsTab && !mapsTab.closed) {
          mapsTab.location.replace(mapsUrl);
          showStatus('Google Maps opened in a new tab.');
        } else {
          showStatus('Your location is ready.', mapsUrl);
        }

        button.disabled = false;
        button.removeAttribute('aria-busy');
        button.textContent = originalLabel;
      },
      (error) => {
        if (mapsTab && !mapsTab.closed) mapsTab.close();

        let message = 'Unable to get your location. Please try again.';
        if (error && error.code === error.PERMISSION_DENIED) {
          message = 'Location permission was denied. Allow location access in your browser settings and try again.';
        } else if (error && error.code === error.POSITION_UNAVAILABLE) {
          message = 'Your location is currently unavailable. Please try again.';
        } else if (error && error.code === error.TIMEOUT) {
          message = 'The location request timed out. Please try again.';
        }

        showStatus(message);
        button.disabled = false;
        button.removeAttribute('aria-busy');
        button.textContent = originalLabel;
      },
      {
        enableHighAccuracy: false,
        timeout: 12000,
        maximumAge: 60000
      }
    );
  });
})();
