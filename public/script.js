    const lots = [
      { id: 'vase', name: 'Ming Dynasty Vase', description: 'A rare 15th-century porcelain vase.', currentBid: 850000, image: 'content/images/vase.jpg' },
      { id: 'painting', name: 'Victorian Landscape', description: 'Oil on canvas, 19th century.', currentBid: 1200, image: 'content/images/painting.jpg' },
      { id: 'chair', name: 'Regency Armchair', description: 'Mahogany armchair, circa 1820.', currentBid: 800, image: 'content/images/chair.jpg' },
      { id: 'clock', name: 'French Mantle Clock', description: 'Gilt bronze clock, 18th century.', currentBid: 1500, image: 'content/images/clock.jpg' },
      { id: 'mirror', name: 'Baroque Mirror', description: 'Ornate giltwood mirror, 17th century.', currentBid: 900, image: 'content/images/mirror.jpg' },
      { id: 'desk', name: 'Georgian Writing Desk', description: 'Walnut desk with inlay, circa 1780.', currentBid: 2000, image: 'content/images/desk.jpg' },
      { id: 'lamp', name: 'Tiffany Lamp', description: 'Stained glass lamp, early 20th century.', currentBid: 2500, image: 'content/images/lamp.jpg' },
      { id: 'rug', name: 'Persian Rug', description: 'Handwoven silk rug, 19th century.', currentBid: 1800, image: 'content/images/rug.jpg' },
      { id: 'sculpture', name: 'Bronze Sculpture', description: 'Classical figure, 18th century.', currentBid: 1100, image: 'content/images/sculpture.jpg' }
    ];

    // as { lotId: { bidAmount } }
    let bids = {};
    let lastBids = null;

    const lotsList = document.getElementById('lots-list');
    const bidsList = document.getElementById('bids-list');
    const bidsEmpty = document.getElementById('bids-empty');
    const bidsConfirmBtn = document.getElementById('bids-confirm-btn');
    const bidCount = document.getElementById('bid-count');
    const bidIcon = document.querySelector('.bid-icon');
    const sections = document.querySelectorAll('.page-section');
    const navLinks = document.querySelectorAll('.nav__link');
    const btnViewLots = document.getElementById('btn-view-lots');
    const homeSection = document.getElementById('home');
    const confirmationText = document.getElementById('confirmation-text');
    const confirmationSequence = document.getElementById('confirmation-sequence');
    const confirmationTotal = document.getElementById('confirmation-total');
    const confirmationItems = document.getElementById('confirmation-items');

    function generateRandomSequence() {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = '';
      for (let i = 0; i < 6; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      return result;
    }

    function saveBids() {
      localStorage.setItem('auction_bids', JSON.stringify(bids));
    }

    function loadBids() {
      try {
        const saved = localStorage.getItem('auction_bids');
        if (saved) {
          bids = JSON.parse(saved);
          if (typeof bids !== 'object' || bids === null) {
            bids = {};
          }
        } else {
          bids = {};
        }
      } catch (e) {
        console.error('Failed to load bids from localStorage:', e);
        bids = {};
      }
    }

    function updateBidBadge() {
      const totalBids = Object.keys(bids).length;
      bidCount.style.display = totalBids > 0 ? 'inline-block' : 'none';
      bidCount.textContent = totalBids;
    }

    function renderLots() {
      lotsList.innerHTML = '';
      lots.forEach(lot => {
        const article = document.createElement('article');
        article.className = 'lot__item';
        article.innerHTML = `
          <img src="${lot.image}" alt="${lot.name}" class="lot__img" />
          <h3 class="lot__item-title">${lot.name}</h3>
          <p class="lot__item-description">${lot.description}</p>
          <div class="lot__item-price">Current Bid: $${lot.currentBid}</div>
          <div class="lot__item-bid">
            <button class="lot__btn-bid" data-id="${lot.id}" data-amount="10">Bid +$10</button>
            <button class="lot__btn-bid" data-id="${lot.id}" data-amount="50">Bid +$50</button>
            <button class="lot__btn-bid" data-id="${lot.id}" data-amount="100">Bid +$100</button>
          </div>
        `;
        lotsList.appendChild(article);
      });
    }

    function renderBids() {
      bidsList.innerHTML = '';
      const lotIds = Object.keys(bids);
      if (lotIds.length === 0) {
        bidsEmpty.style.display = 'block';
        bidsConfirmBtn.innerHTML = `Browse Lots`;
        return;
      }
      bidsEmpty.style.display = 'none';
      let totalBidAmount = 0;
      lotIds.forEach(lotId => {
        const bidAmount = bids[lotId].bidAmount;
        const lot = lots.find(l => l.id === lotId);
        if (!lot) {
          console.warn(`Lot with ID ${lotId} not found, skipping`);
          return;
        }
        const li = document.createElement('li');
        li.className = 'bids__item';
        li.setAttribute('data-lot-id', lotId);
        totalBidAmount += bidAmount;
        li.innerHTML = `
          <div class="bids__item-info">
            <div class="bids__item-name">${lot.name}</div>
            <div class="bids__item-amount">Your Bid: $${bidAmount}</div>
          </div>
        `;
        bidsList.appendChild(li);
      });
      bidsConfirmBtn.innerHTML = `Confirm Bids (Total: $${totalBidAmount})`;
    }

    function clearBids() {
      bids = {};
      saveBids();
      updateBidBadge();
      renderLots();
    }

    function setActiveSection(targetId) {
      sections.forEach(section => {
        section.classList.toggle('page-section--active', section.id === targetId);
      });
      navLinks.forEach(link => {
        link.classList.toggle('nav__link--active', link.dataset.target === targetId);
      });
      btnViewLots.classList.toggle('button--hidden', targetId !== 'home');
      homeSection.classList.toggle('home--reduced', targetId !== 'home');
      if (targetId === 'bids') {
        renderBids();
      } else if (targetId === 'lots') {
        renderLots();
      }
    }

    function showConfirmation(totalBids, totalAmount, bidItems) {
      setActiveSection('confirmation');
      const randomSequence = generateRandomSequence();
      confirmationSequence.textContent = `Bid ID: ${randomSequence}`;
      confirmationText.textContent = `You have placed ${totalBids} bid(s). Thank you for participating!`;
      confirmationTotal.textContent = `Total: $${totalAmount}`;
      confirmationItems.innerHTML = '';
      bidItems.forEach(({ lot, bidAmount }) => {
        if (!lot) {
          console.warn('Invalid lot in bidItems, skipping');
          return;
        }
        const div = document.createElement('div');
        div.className = 'confirmation__item';
        div.innerHTML = `
          ${lot.name}
          <div class="confirmation__item-price">Bid: $${bidAmount}</div>
        `;
        confirmationItems.appendChild(div);
      });
    }

    function handleLotButtonClick(e) {
      const target = e.target;
      if (!target.classList.contains('lot__btn-bid')) return;
      const lotId = target.dataset.id;
      const bidIncrement = parseInt(target.dataset.amount, 10);
      if (!lotId || isNaN(bidIncrement)) return;
      const lot = lots.find(l => l.id === lotId);
      if (!lot) {
        console.error(`Lot with ID ${lotId} not found`);
        return;
      }
      const newBid = lot.currentBid + bidIncrement;
      if (bids[lotId] && bids[lotId].bidAmount >= newBid) {
        alert(`Your current bid of $${bids[lotId].bidAmount} is higher than or equal to the proposed bid of $${newBid}. Please place a higher bid.`);
        return;
      }
      lot.currentBid = newBid;
      bids[lotId] = { bidAmount: newBid };
      saveBids();
      updateBidBadge();
      renderLots();
    }

    function handleBidIconClick() {
      setActiveSection('bids');
    }

    function handleBidsConfirmClick() {
      const totalBids = Object.keys(bids).length;
      if (totalBids === 0) {
        setActiveSection('lots');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        bidsConfirmBtn.innerHTML = `Browse Lots`;
        return;
      }
      const totalAmount = Object.values(bids).reduce((acc, bid) => acc + bid.bidAmount, 0);
      lastBids = Object.keys(bids).map(lotId => {
        const lot = lots.find(l => l.id === lotId);
        if (!lot) {
          console.warn(`Lot with ID ${lotId} not found, skipping`);
          return null;
        }
        return { lot, bidAmount: bids[lotId].bidAmount };
      }).filter(bid => bid !== null);
      clearBids();
      showConfirmation(totalBids, totalAmount, lastBids);
    }

    function handleConfirmationBackClick() {
      setActiveSection('lots');
      lastBids = null;
    }

    function init() {
      loadBids();
      updateBidBadge();
      renderLots();
      lotsList.addEventListener('click', handleLotButtonClick);
      bidIcon.addEventListener('click', handleBidIconClick);
      bidsConfirmBtn.addEventListener('click', handleBidsConfirmClick);
      document.getElementById('confirmation-back-btn').addEventListener('click', handleConfirmationBackClick);
      document.querySelector('.nav__list').addEventListener('click', e => {
        const link = e.target.closest('.nav__link');
        if (link) {
          e.preventDefault();
          setActiveSection(link.dataset.target);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
      btnViewLots.addEventListener('click', () => {
        setActiveSection('lots');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    window.onload = init;