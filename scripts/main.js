
if (!('serviceWorker' in navigator)) {
	console.log('Service Worker not supported');
	//return;
}

navigator.serviceWorker.register('/service-worker.js')
 .then(function(registration) {
	console.log('SW registered! Scope is:', registration.scope);
}); // .catch a registration error