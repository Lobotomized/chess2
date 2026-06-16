const CACHE_NAME = 'chess2-cache-v35';
const urlsToCache = [
  '/',
  '/campaign.html',
  '/static/menuBg.png',
  '/static/rpgBg.png',
  '/static/campaignBg.png',
  '/static/rpgTopBar.png',
  '/static/bigMap/clockIcon.png',
  '/rpg.html',
  '/rpg-menu',
  '/single-player',
  '/hotseat-menu',
  '/customMaps',
  '/manifest.json',
  '/sw.js',
  '/src/auth.js',
  '/src/modal.js',
  '/src/jsonfn.js',
  '/src/coreAlgorithms.js',
  '/src/globby.js',
  '/src/loadImages.js',
  '/src/variables.js',
  '/src/rpg/rpgPieceDescriptions.js',
  '/src/webworker.js',
  '/evolutionWorker.js',
  '/src/rpg/rpg.js',
  '/src/rpg/rpgStats.js',
  '/src/rpg/rpgDifficulties.js',
  '/src/rpg/rpgDetails.js',
  '/src/rpg/grandMap.js',
  '/src/rpg/mapVisuals.js',
  '/boardGeneration.js',
  '/helperFunctions.js',
  '/moveMethods.js',
  '/customEffects.js',
  '/src/AI/general.js',
  '/src/AI/magnifiers.js',
  '/src/AI/filters.js',
  '/pieces/classic.js',
  '/pieces/bugs.js',
  '/pieces/animals.js',
  '/pieces/cats.js',
  '/pieces/medieval.js',
  '/pieces/machines.js',
  '/pieces/rpg.js',
  '/pieces/misc.js',
  '/pieceDefinitions.js',
  '/static/lg/arrow.svg',
  '/static/lg/attack.svg',
  '/static/lg/blackAnt.png',
  '/static/lg/blackBishop.png',
  '/static/lg/blackBishop.svg',
  '/static/lg/blackBlindCat.png',
  '/static/lg/blackBootvessel.png',
  '/static/lg/blackBrainBug.png',
  '/static/lg/blackClown.png',
  '/static/lg/blackCrystal.png',
  '/static/lg/blackCrystalEmpowered.png',
  '/static/lg/blackCuteCat.png',
  '/static/lg/blackCyborg.png',
  '/static/lg/blackDragon.png',
  '/static/lg/blackDragon.svg',
  '/static/lg/blackElectricCat.png',
  '/static/lg/blackExecutor.png',
  '/static/lg/blackFatCat.png',
  '/static/lg/blackFencer.png',
  '/static/lg/blackFencer.svg',
  '/static/lg/blackGargoyle.png',
  '/static/lg/blackGeneral.png',
  '/static/lg/blackGeneral.svg',
  '/static/lg/blackGhost.png',
  '/static/lg/blackGoliathBug.png',
  '/static/lg/blackHat.png',
  '/static/lg/blackHorse.png',
  '/static/lg/blackJuggernaut.png',
  '/static/lg/blackKing.png',
  '/static/lg/blackKing.svg',
  '/static/lg/blackKnight.png',
  '/static/lg/blackKnight.svg',
  '/static/lg/blackKolba.png',
  '/static/lg/blackKolba.svg',
  '/static/lg/blackLadyBug.png',
  '/static/lg/blackLongCat.png',
  '/static/lg/blackLongCatRezerva.png',
  '/static/lg/blackNorthernKing.png',
  '/static/lg/blackNorthernKing.svg',
  '/static/lg/blackPawn.png',
  '/static/lg/blackPawn.svg',
  '/static/lg/blackPig.png',
  '/static/lg/blackPikeman.png',
  '/static/lg/blackPikeman.svg',
  '/static/lg/blackPlagueDoctor.png',
  '/static/lg/blackQueen.png',
  '/static/lg/blackQueen.svg',
  '/static/lg/blackQueenBug.png',
  '/static/lg/blackRicar.png',
  '/static/lg/blackRook.png',
  '/static/lg/blackRook.svg',
  '/static/lg/blackScaryCat.png',
  '/static/lg/blackShield.png',
  '/static/lg/blackShield.svg',
  '/static/lg/blackShroom.png',
  '/static/lg/blackSleepingDragon.png',
  '/static/lg/blackSleepingDragon.svg',
  '/static/lg/blackSpider.png',
  '/static/lg/blackStarMan.png',
  '/static/lg/blackSwordsmen.png',
  '/static/lg/blackSwordsmen.svg',
  '/static/lg/Shogi_gote_side_King.svg',
  '/static/lg/whiteAnt.png',
  '/static/lg/whiteBishop.png',
  '/static/lg/whiteBishop.svg',
  '/static/lg/whiteBlindCat.png',
  '/static/lg/whiteBootvessel.png',
  '/static/lg/whiteBrainBug.png',
  '/static/lg/whiteClown.png',
  '/static/lg/whiteCrystal.png',
  '/static/lg/whiteCrystalEmpowered.png',
  '/static/lg/whiteCuteCat.png',
  '/static/lg/whiteCyborg.png',
  '/static/lg/whiteDragon.png',
  '/static/lg/whiteDragon.svg',
  '/static/lg/whiteElectricCat.png',
  '/static/lg/whiteExecutor.png',
  '/static/lg/whiteFatCat.png',
  '/static/lg/whiteFencer.png',
  '/static/lg/whiteFencer.svg',
  '/static/lg/whiteFlag.svg',
  '/static/lg/whiteGargoyle.png',
  '/static/lg/whiteGeneral.png',
  '/static/lg/whiteGeneral.svg',
  '/static/lg/whiteGhost.png',
  '/static/lg/whiteGoliathBug.png',
  '/static/lg/whiteHat.png',
  '/static/lg/whiteHorse.png',
  '/static/lg/whiteJuggernaut.png',
  '/static/lg/whiteKing.png',
  '/static/lg/whiteKing.svg',
  '/static/lg/whiteKnight.png',
  '/static/lg/whiteKnight.svg',
  '/static/lg/whiteKolba.png',
  '/static/lg/whiteKolba.svg',
  '/static/lg/whiteLadyBug.png',
  '/static/lg/whiteLongCat.png',
  '/static/lg/whiteNorthernKing.png',
  '/static/lg/whiteNorthernKing.svg',
  '/static/lg/whitePawn.png',
  '/static/lg/whitePawn.svg',
  '/static/lg/whitePig.png',
  '/static/lg/whitePikeman.png',
  '/static/lg/whitePikeman.svg',
  '/static/lg/whitePlagueDoctor.png',
  '/static/lg/whiteQueen.png',
  '/static/lg/whiteQueen.svg',
  '/static/lg/whiteQueenBug.png',
  '/static/lg/whiteRicar.png',
  '/static/lg/whiteRook.png',
  '/static/lg/whiteRook.svg',
  '/static/lg/whiteScaryCat.png',
  '/static/lg/whiteShield.png',
  '/static/lg/whiteShield.svg',
  '/static/lg/whiteShroom.png',
  '/static/lg/whiteSleepingDragon.png',
  '/static/lg/whiteSleepingDragon.svg',
  '/static/lg/whiteSpider.png',
  '/static/lg/whiteStarMan.png',
  '/static/lg/whiteSwordsmen.png',
  '/static/lg/whiteSwordsmen.svg',
  '/static/sm/blackAnt.png',
  '/static/sm/blackBishop.png',
  '/static/sm/blackBlindCat.png',
  '/static/sm/blackBootvessel.png',
  '/static/sm/blackBrainBug.png',
  '/static/sm/blackClown.png',
  '/static/sm/blackCrystal.png',
  '/static/sm/blackCrystalEmpowered.png',
  '/static/sm/blackCuteCat.png',
  '/static/sm/blackCyborg.png',
  '/static/sm/blackDragon.png',
  '/static/sm/blackElectricCat.png',
  '/static/sm/blackExecutor.png',
  '/static/sm/blackFatCat.png',
  '/static/sm/blackFencer.png',
  '/static/sm/blackGargoyle.png',
  '/static/sm/blackGeneral.png',
  '/static/sm/blackGhost.png',
  '/static/sm/blackGoliathBug.png',
  '/static/sm/blackHat.png',
  '/static/sm/blackHorse.png',
  '/static/sm/blackJuggernaut.png',
  '/static/sm/blackKing.png',
  '/static/sm/blackKnight.png',
  '/static/sm/blackKolba.png',
  '/static/sm/blackLadyBug.png',
  '/static/sm/blackLongCat.png',
  '/static/sm/blackLongCatRezerva.png',
  '/static/sm/blackNorthernKing.png',
  '/static/sm/blackPawn.png',
  '/static/sm/blackPig.png',
  '/static/sm/blackPikeman.png',
  '/static/sm/blackPlagueDoctor.png',
  '/static/sm/blackQueen.png',
  '/static/sm/blackQueenBug.png',
  '/static/sm/blackRicar.png',
  '/static/sm/blackRook.png',
  '/static/sm/blackScaryCat.png',
  '/static/sm/blackShield.png',
  '/static/sm/blackShroom.png',
  '/static/sm/blackSleepingDragon.png',
  '/static/sm/blackSpider.png',
  '/static/sm/blackStarMan.png',
  '/static/sm/blackSwordsmen.png',
  '/static/sm/bpawn2-b.png',
  '/static/sm/rook-b.png',
  '/static/sm/rook-w.png',
  '/static/sm/rook4-b.png',
  '/static/sm/rook4-w.png',
  '/static/sm/rqueen-b.png',
  '/static/sm/rqueen-w.png',
  '/static/sm/whiteAnt.png',
  '/static/sm/whiteBishop.png',
  '/static/sm/whiteBlindCat.png',
  '/static/sm/whiteBootvessel.png',
  '/static/sm/whiteBrainBug.png',
  '/static/sm/whiteClown.png',
  '/static/sm/whiteCrystal.png',
  '/static/sm/whiteCrystalEmpowered.png',
  '/static/sm/whiteCuteCat.png',
  '/static/sm/whiteCyborg.png',
  '/static/sm/whiteDragon.png',
  '/static/sm/whiteElectricCat.png',
  '/static/sm/whiteExecutor.png',
  '/static/sm/whiteFatCat.png',
  '/static/sm/whiteFencer.png',
  '/static/sm/whiteGargoyle.png',
  '/static/sm/whiteGeneral.png',
  '/static/sm/whiteGhost.png',
  '/static/sm/whiteGoliathBug.png',
  '/static/sm/whiteHat.png',
  '/static/sm/whiteHorse.png',
  '/static/sm/whiteJuggernaut.png',
  '/static/sm/whiteKing.png',
  '/static/sm/whiteKnight.png',
  '/static/sm/whiteKolba.png',
  '/static/sm/whiteLadyBug.png',
  '/static/sm/whiteLongCat.png',
  '/static/sm/whiteNorthernKing.png',
  '/static/sm/whitePawn.png',
  '/static/sm/whitePig.png',
  '/static/sm/whitePikeman.png',
  '/static/sm/whitePlagueDoctor.png',
  '/static/sm/whiteQueen.png',
  '/static/sm/whiteQueenBug.png',
  '/static/sm/whiteRicar.png',
  '/static/sm/whiteRook.png',
  '/static/sm/whiteScaryCat.png',
  '/static/sm/whiteShield.png',
  '/static/sm/whiteShroom.png',
  '/static/sm/whiteSleepingDragon.png',
  '/static/sm/whiteSpider.png',
  '/static/sm/whiteStarMan.png',
  '/static/sm/whiteSwordsmen.png',
  '/static/bigMap/desert1.png',
  '/static/bigMap/desert2.png',
  '/static/bigMap/desert3.png',
  '/static/bigMap/desert4.png',
  '/static/bigMap/forest1.png',
  '/static/bigMap/forest2.png',
  '/static/bigMap/forest3.png',
  '/static/bigMap/forest4.png',
  '/static/bigMap/lake1.png',
  '/static/bigMap/library.jpg',
  '/static/bigMap/inn.jpg',
  '/static/bigMap/mountain.jpg',
  '/static/bigMap/plains1.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  // Only cache GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  const url = new URL(event.request.url);

  // Exclude API calls from cache-first strategy
  if (url.pathname.startsWith('/api/') || url.pathname === '/maps' || url.pathname.startsWith('/maps/') || url.pathname === '/allgames') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(JSON.stringify({ error: 'Offline' }), {
          headers: { 'Content-Type': 'application/json' },
          status: 503
        });
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true })
      .then(response => {
        // Cache hit - return response
        if (response) {
          // Fetch and update cache in background
          fetch(event.request).then(netResponse => {
             if (netResponse && netResponse.status === 200 && (netResponse.type === 'basic' || netResponse.type === 'cors' || netResponse.type === 'opaque')) {
                 let responseToCache = netResponse.clone();
                 caches.open(CACHE_NAME).then(cache => {
                     // Store using the original request URL (including search params)
                     // or update the base URL cache
                     if(cache.put){
                       cache.put(event.request, responseToCache);
                     }
                 });
             }
          }).catch(() => {});
          
          return response;
        }

        // Cache miss - fetch from network
        return fetch(event.request).then(
          function(response) {
            // Check if we received a valid response
            // Allow caching of opaque responses (like cross-origin images or basic responses)
            if(!response || response.status !== 200 || (response.type !== 'basic' && response.type !== 'cors' && response.type !== 'opaque')) {
              return response;
            }

            // Clone response to put in cache
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        ).catch(function() {
            // If network fails and not in cache, returning a fallback could be added here
        });
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});