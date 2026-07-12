document.addEventListener('DOMContentLoaded', function () {

  if (typeof siteData === 'undefined' || !siteData) return;
  var data = siteData;

  function getStore(key) { return JSON.parse(localStorage.getItem('edit_' + key) || 'null'); }
  function getData(key) { var s = getStore(key); return s !== null ? s : (data[key] || null); }

  /* ==================== RENDER SECTIONS ==================== */

  /* NAV */
  var navList = document.getElementById('nav-links');
  if (navList && data.nav) {
    var isKkn = window.location.pathname.indexOf('kkn.html') > -1;
    var prefix = isKkn ? 'index.html' : '';
    navList.innerHTML = data.nav.map(function (item) {
      return '<li><a href="' + (prefix ? prefix + item.href : item.href) + '">' + item.label + '</a></li>';
    }).join('');
    if (!isKkn) {
      navList.innerHTML += '<li><a href="kkn.html" style="color:#e07a5f;">Cerita KKN</a></li>';
    }
  }

  /* HERO IMAGE OVERRIDE */
  var heroImg = document.getElementById('heroBgImg');
  var savedHeroImg = localStorage.getItem('edit_img_hero');
  // Clear old saved image if it matches previous default
  if (savedHeroImg && savedHeroImg.indexOf('photo-1506905925346') > -1) {
    localStorage.removeItem('edit_img_hero');
    savedHeroImg = null;
  }
  if (heroImg) {
    if (savedHeroImg && savedHeroImg.trim() !== '') {
      heroImg.src = savedHeroImg;
    } else {
      heroImg.src = 'https://images.unsplash.com/photo-1759574981176-2ccab9970471?w=1200&q=80';
    }
  }

  /* HERO */
  var heroBadge = document.getElementById('heroBadge');
  var heroTitle = document.getElementById('heroTitle');
  var heroDesc = document.getElementById('heroDesc');
  var heroStats = document.getElementById('heroStats');
  var heroData = getData('hero');
  if (heroData) {
    if (heroBadge) heroBadge.textContent = heroData.badge;
    if (heroTitle) heroTitle.innerHTML = heroData.title;
    if (heroDesc) heroDesc.textContent = heroData.description;
    if (heroStats && heroData.stats) {
      heroStats.innerHTML = heroData.stats.map(function (s) {
        return '<div class="hero-stat"><div class="num">' + s.value + '</div><div class="lbl">' + s.label + '</div></div>';
      }).join('');
    }
  }

  /* PROFILE */
  var profileTitle = document.getElementById('profileTitle');
  var profileDesc1 = document.getElementById('profileDesc1');
  var profileDesc2 = document.getElementById('profileDesc2');
  var profileStats = document.getElementById('profileStats');
  var profileData = getData('profile');
  if (profileData) {
    if (profileTitle) profileTitle.textContent = profileData.title;
    if (profileDesc1) profileDesc1.textContent = profileData.description1;
    if (profileDesc2) profileDesc2.textContent = profileData.description2;
    if (profileStats && profileData.stats) {
      profileStats.innerHTML = profileData.stats.map(function (s) {
        return '<div class="stat-item"><div class="num">' + s.value + '</div><div class="lbl">' + s.label + '</div></div>';
      }).join('');
    }
  }

  /* NEWS */
  renderNews();

  /* CARDS */
  renderCards('destinationsGrid', getData('destinations'));
  renderCards('culinaryGrid', getData('culinary'));
  renderCards('accommodationGrid', getData('accommodation'));

  /* SERVICES */
  renderServices();

  /* UMKM */
  renderUMKM();

  /* GALLERY */
  renderGallery();

  /* TESTIMONIALS */
  renderTestimonials();

  /* EVENTS */
  renderEvents();

  /* PERANGKAT DESA */
  renderPerangkat();

  /* STRUKTUR ORGANISASI */
  renderStruktur();

  /* ANGGARAN DESA */
  renderAnggaran();

  /* TENTANG MAPS */
  var tentangAddress = document.getElementById('tentangAddress');
  var tentangMapsLink = document.getElementById('tentangMapsLink');
  var contactData = getData('contact');
  if (contactData) {
    if (tentangAddress) tentangAddress.textContent = contactData.address;
    if (tentangMapsLink) tentangMapsLink.href = contactData.maps_url;
  }

  /* TENTANG CONTACT */
  renderTentangContact();

  /* FOOTER */
  renderFooter();

  /* ==================== RENDER FUNCTIONS ==================== */

  function renderNews() {
    var grid = document.getElementById('newsGrid');
    var newsData = getData('news');
    if (!grid || !newsData) return;
    grid.innerHTML = newsData.map(function (item) {
      var parts = item.date.split(' ');
      var day = parts[0];
      var rest = parts.slice(1).join(' ');
      return '<div class="press-item reveal">' +
        '<div class="press-date">' +
          '<span class="press-date-day">' + day + '</span>' +
          '<span class="press-date-rest">' + rest + '</span>' +
        '</div>' +
        '<div class="press-body">' +
          '<div class="press-category ' + item.category.toLowerCase() + '">' + item.category + '</div>' +
          '<h3>' + item.title + '</h3>' +
          '<p>' + item.excerpt + '</p>' +
          '<a href="#" class="press-link">Baca Selengkapnya &rarr;</a>' +
        '</div></div>';
    }).join('');
  }

  function renderCards(gridId, items) {
    var grid = document.getElementById(gridId);
    if (!grid || !items) return;
    grid.innerHTML = items.map(function (item) {
      return '<div class="card reveal">' +
        '<div class="card-image"><div class="placeholder">' + item.icon + '</div></div>' +
        '<div class="card-body">' +
        '<span class="card-tag">' + item.tag + '</span>' +
        '<h3>' + item.name + '</h3>' +
        '<p>' + item.description + '</p>' +
        '</div></div>';
    }).join('');
  }

  function renderServices() {
    var grid = document.getElementById('servicesGrid');
    var servicesData = getData('services');
    if (!grid || !servicesData) return;
    grid.innerHTML = servicesData.map(function (item) {
      return '<div class="service-card reveal">' +
        '<div class="service-icon">' + item.icon + '</div>' +
        '<h3>' + item.name + '</h3>' +
        '<p>' + item.description + '</p>' +
        '<div class="service-req"><strong>Persyaratan:</strong> ' + item.requirements + '</div>' +
        '<button class="btn btn-primary btn-service-apply" data-id="' + item.id + '" style="margin-top:20px;width:100%;justify-content:center;padding:12px 20px;font-size:0.7rem;">Ajukan Online</button>' +
        '</div>';
    }).join('');
  }

  function renderUMKM() {
    var grid = document.getElementById('umkmGrid');
    var umkmData = getData('umkm');
    if (!grid || !umkmData) return;
    grid.innerHTML = umkmData.map(function (item) {
      return '<div class="umkm-card reveal">' +
        '<div class="umkm-icon">' + item.icon + '</div>' +
        '<div class="umkm-body">' +
        '<h3>' + item.name + '</h3>' +
        '<p>' + item.description + '</p>' +
        '<div class="umkm-owner">\u2714 ' + item.owner + '</div>' +
        '</div></div>';
    }).join('');
  }

  function renderGallery() {
    var grid = document.getElementById('galleryGrid');
    var galleryData = getData('gallery');
    if (!grid || !galleryData) return;
    grid.innerHTML = galleryData.map(function (item) {
      var style = '';
      if (item.span === 2) {
        style = ' style="grid-column:span 2;"';
      }
      return '<div class="gallery-item reveal" data-label="' + item.label + '"' + style + '>' +
        '<div class="placeholder">' + item.icon + '</div>' +
        '<div class="overlay">' + item.label + '</div></div>';
    }).join('');
  }

  function renderTestimonials() {
    var grid = document.getElementById('testimonialsGrid');
    var testimoniData = getData('testimonials');
    if (!grid || !testimoniData) return;
    grid.innerHTML = testimoniData.map(function (item) {
      var stars = '';
      for (var i = 0; i < (item.stars || 5); i++) stars += '\u2605';
      return '<div class="testimonial-card reveal">' +
        '<div class="stars">' + stars + '</div>' +
        '<p class="quote">"' + item.quote + '"</p>' +
        '<div class="author">' +
        '<div class="author-avatar">' + item.initial + '</div>' +
        '<div class="author-info">' +
        '<h4>' + item.name + '</h4>' +
        '<p>' + item.from + '</p>' +
        '</div></div></div>';
    }).join('');
  }

  function renderEvents() {
    var timeline = document.getElementById('timeline');
    var eventsData = getData('events');
    if (!timeline || !eventsData) return;
    timeline.innerHTML = eventsData.map(function (item) {
      return '<div class="timeline-item reveal">' +
        '<div class="date">' + item.date + '</div>' +
        '<h4>' + item.title + '</h4>' +
        '<p>' + item.description + '</p></div>';
    }).join('');
  }

  function renderContact() {
    var container = document.getElementById('contactInfo');
    var contactData = getData('contact');
    if (!container || !contactData) return;
    var c = contactData;
    var html = '<h3>Informasi Kontak</h3>';
    html += '<div class="contact-info-item"><div class="icon">\uD83D\uDCCD</div><div><h4>Alamat</h4><p>' + c.address + '</p></div></div>';
    html += '<div class="contact-info-item"><div class="icon">\u2709\uFE0F</div><div><h4>Email</h4><a href="mailto:' + c.email + '">' + c.email + '</a></div></div>';
    html += '<div class="contact-info-item"><div class="icon">\uD83D\uDD50</div><div><h4>Jam Pelayanan</h4><p>' + c.hours + '</p></div></div>';
    html += '<div class="contact-info-item"><div class="icon">\uD83D\uDCF7</div><div><h4>Instagram</h4><a href="' + c.instagram_url + '" target="_blank" rel="noopener" style="color:#00838f;font-weight:600;">' + c.instagram + '</a></div></div>';
    container.innerHTML = html;
  }

  function renderFooter() {
    var container = document.getElementById('footerContent');
    if (!container) return;
    var siteData = getData('site');
    var contactData = getData('contact');
    var footerLinks = getData('footer_links');
    var html = '';
    html += '<div><h4>' + siteData.name + '</h4><p>Kecamatan Cijeruk, Kabupaten Bogor</p><p>Jawa Barat 16740</p><p style="margin-top:8px;">' + contactData.email + '</p><div class="social-links"><a href="' + contactData.instagram_url + '" target="_blank" rel="noopener" title="Instagram">IG</a></div></div>';
    if (footerLinks) {
      footerLinks.forEach(function (group) {
        html += '<div><h4>' + group.title + '</h4>';
        group.links.forEach(function (link) {
          html += '<a href="' + link.href + '">' + link.label + '</a><br />';
        });
        html += '</div>';
      });
    }
    html += '<div class="copyright">&copy; 2026 ' + siteData.name + '. ' + siteData.footer + '</div>';
    container.innerHTML = html;
  }

  function renderPerangkat() {
    var grid = document.getElementById('perangkatGrid');
    var perangkatData = getData('perangkat_desa');
    if (!grid || !perangkatData) return;
    grid.innerHTML = perangkatData.map(function (item) {
      return '<div class="perangkat-card reveal">' +
        '<div class="perangkat-icon">' + item.icon + '</div>' +
        '<h3>' + item.nama + '</h3>' +
        '<div class="perangkat-jabatan">' + item.jabatan + '</div>' +
        '<div class="perangkat-bidang">' + item.bidang + '</div>' +
        '</div>';
    }).join('');
  }

  function renderStruktur() {
    var container = document.getElementById('strukturChart');
    var strukturData = getData('struktur_organisasi');
    if (!container || !strukturData) return;
    var levels = [[], [], []];
    strukturData.forEach(function (item) {
      var idx = item.level - 1;
      if (idx >= 0 && idx < 3) levels[idx].push(item);
    });
    var html = '<div class="struktur-chart">';
    levels.forEach(function (level, li) {
      if (level.length === 0) return;
      if (li > 0) {
        html += '<div class="struktur-connector"></div>';
      }
      html += '<div class="struktur-level">';
      level.forEach(function (item) {
        html += '<div class="struktur-item level-' + item.level + '">' +
          '<div class="struktur-jabatan">' + item.jabatan + '</div>' +
          '<div class="struktur-nama">' + item.nama + '</div>' +
          '</div>';
      });
      html += '</div>';
    });
    html += '</div>';
    container.innerHTML = html;
  }

  function renderAnggaran() {
    var container = document.getElementById('anggaranTable');
    var anggaranData = getData('anggaran_desa');
    if (!container || !anggaranData) return;
    var html = '<div class="table-wrapper"><table class="anggaran-table">' +
      '<thead><tr><th>Bidang</th><th>Anggaran</th><th>Sumber</th><th>Keterangan</th></tr></thead><tbody>';
    anggaranData.forEach(function (item) {
      html += '<tr>' +
        '<td>' + item.bidang + '</td>' +
        '<td class="anggaran-nominal">' + item.anggaran + '</td>' +
        '<td><span class="anggaran-sumber">' + item.sumber + '</span></td>' +
        '<td>' + item.keterangan + '</td>' +
        '</tr>';
    });
    html += '</tbody></table></div>';
    container.innerHTML = html;
  }

  function renderTentangContact() {
    var container = document.getElementById('tentangContact');
    var contactData = getData('contact');
    if (!container || !contactData) return;
    var c = contactData;
    var html = '';
    html += '<div class="contact-info-item"><div class="icon">\u2709\uFE0F</div><div><h4>Email</h4><a href="mailto:' + c.email + '">' + c.email + '</a></div></div>';
    html += '<div class="contact-info-item"><div class="icon">\uD83D\uDD50</div><div><h4>Jam Pelayanan</h4><p>' + c.hours + '</p></div></div>';
    html += '<div class="contact-info-item"><div class="icon">\uD83D\uDCF7</div><div><h4>Instagram</h4><a href="' + c.instagram_url + '" target="_blank" rel="noopener" style="color:#00838f;font-weight:600;">' + c.instagram + '</a></div></div>';
    container.innerHTML = html;
  }

  /* ==================== EXISTING FEATURES ==================== */

  /* HEADER SCROLL */
  var header = document.querySelector('header');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    var sections = document.querySelectorAll('section[id]');
    var navAnchors = document.querySelectorAll('.nav-links a');
    var current = '';
    sections.forEach(function (section) {
      var top = section.offsetTop - 150;
      var bottom = top + section.offsetHeight;
      if (window.scrollY >= top && window.scrollY < bottom) {
        current = section.getAttribute('id');
      }
    });
    navAnchors.forEach(function (a) {
      a.classList.remove('active');
      if (a.getAttribute('href') === '#' + current) {
        a.classList.add('active');
      }
    });
  });

  /* HAMBURGER */
  var hamburger = document.querySelector('.hamburger');
  var navLinks = document.querySelector('.nav-links');
  if (hamburger) {
    hamburger.addEventListener('click', function () {
      navLinks.classList.toggle('open');
    });
    document.querySelectorAll('.nav-links a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
      });
    });
  }

  /* LIGHTBOX */
  var lightbox = document.querySelector('.lightbox');
  var lightboxContent = document.querySelector('.lightbox-content');
  var lightboxClose = document.querySelector('.lightbox-close');
  var galleryItems = document.querySelectorAll('.gallery-item');
  if (galleryItems.length > 0 && lightbox) {
    galleryItems.forEach(function (item) {
      item.addEventListener('click', function () {
        var label = this.getAttribute('data-label') || 'Foto Desa Warung Menteng';
        var bg = this.querySelector('.placeholder');
        var text = bg ? bg.textContent : '';
        if (lightboxContent) {
          lightboxContent.innerHTML = '<div class="lightbox-placeholder">' + text + '</div><p>' + label + '</p>';
        }
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });
    lightbox.addEventListener('click', function () {
      this.classList.remove('active');
      document.body.style.overflow = '';
    });
    if (lightboxClose) {
      lightboxClose.addEventListener('click', function () {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  /* REVEAL ANIMATION */
  var revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* CONTACT FORM */
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('name').value.trim();
      var email = document.getElementById('email').value.trim();
      var subject = document.getElementById('subject').value.trim();
      var message = document.getElementById('message').value.trim();
      var msg = {
        id: Date.now(),
        name: name,
        email: email,
        subject: subject,
        message: message,
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      };
      var existing = JSON.parse(localStorage.getItem('pesanKontak') || '[]');
      existing.unshift(msg);
      localStorage.setItem('pesanKontak', JSON.stringify(existing));
      var btn = this.querySelector('button[type="submit"]');
      var originalText = btn.textContent;
      btn.textContent = '\u2713 Pesan Terkirim!';
      btn.style.background = '#059669';
      setTimeout(function () {
        btn.textContent = originalText;
        btn.style.background = '';
      }, 3000);
      this.reset();
    });
  }

  /* SMOOTH SCROLL */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ==================== SEARCH ==================== */

  var searchToggle = document.getElementById('searchToggle');
  var searchBar = document.getElementById('searchBar');
  var searchInput = document.getElementById('searchInput');
  var searchResults = document.getElementById('searchResults');
  var searchOverlay = document.getElementById('searchOverlay');

  var searchData = [];

  function buildSearchIndex() {
    searchData = [];
    var newsData = getData('news');
    if (newsData) {
      newsData.forEach(function (item) {
        searchData.push({ type: 'Berita', title: item.title, desc: item.excerpt, href: '#berita', tag: item.category });
      });
    }
    var umkmData = getData('umkm');
    if (umkmData) {
      umkmData.forEach(function (item) {
        searchData.push({ type: 'UMKM', title: item.name, desc: item.description, href: '#umkm', tag: item.owner });
      });
    }
    var destData = getData('destinations');
    if (destData) {
      destData.forEach(function (item) {
        searchData.push({ type: 'Destinasi', title: item.name, desc: item.description, href: '#wisata', tag: item.tag });
      });
    }
    var culinaryData = getData('culinary');
    if (culinaryData) {
      culinaryData.forEach(function (item) {
        searchData.push({ type: 'Kuliner', title: item.name, desc: item.description, href: '#wisata', tag: item.tag });
      });
    }
    var accomData = getData('accommodation');
    if (accomData) {
      accomData.forEach(function (item) {
        searchData.push({ type: 'Penginapan', title: item.name, desc: item.description, href: '#wisata', tag: item.tag });
      });
    }
    var servicesData = getData('services');
    if (servicesData) {
      servicesData.forEach(function (item) {
        searchData.push({ type: 'Layanan', title: item.name, desc: item.description, href: '#layanan', tag: 'Layanan Desa' });
      });
    }
    var eventsData = getData('events');
    if (eventsData) {
      eventsData.forEach(function (item) {
        searchData.push({ type: 'Acara', title: item.title, desc: item.description, href: '#acara', tag: item.date });
      });
    }
    var perangkatData = getData('perangkat_desa');
    if (perangkatData) {
      perangkatData.forEach(function (item) {
        searchData.push({ type: 'Perangkat Desa', title: item.nama, desc: item.jabatan + ' - ' + item.bidang, href: '#tentang', tag: item.jabatan });
      });
    }
    var anggaranData = getData('anggaran_desa');
    if (anggaranData) {
      anggaranData.forEach(function (item) {
        searchData.push({ type: 'Anggaran Desa', title: item.bidang, desc: item.anggaran + ' - ' + item.keterangan, href: '#tentang', tag: item.sumber });
      });
    }
  }

  buildSearchIndex();

  function performSearch(query) {
    if (!query || query.length < 2) {
      searchResults.classList.remove('active');
      searchResults.innerHTML = '';
      return;
    }
    var q = query.toLowerCase();
    var matches = searchData.filter(function (item) {
      return item.title.toLowerCase().indexOf(q) > -1 ||
        item.desc.toLowerCase().indexOf(q) > -1 ||
        (item.tag && item.tag.toLowerCase().indexOf(q) > -1);
    });
    if (matches.length === 0) {
      searchResults.innerHTML = '<div class="search-no-result">Tidak ditemukan hasil untuk "' + query + '"</div>';
    } else {
      searchResults.innerHTML = matches.slice(0, 8).map(function (item) {
        return '<a href="' + item.href + '" class="search-result-item">' +
          '<div class="sr-title">' + item.title + '</div>' +
          '<div class="sr-desc">' + item.desc.substring(0, 100) + '...</div>' +
          '<span class="sr-tag">' + item.type + '</span>' +
          '</a>';
      }).join('');
    }
    searchResults.classList.add('active');
  }

  if (searchToggle && searchBar) {
    searchToggle.addEventListener('click', function () {
      searchBar.classList.toggle('open');
      if (searchBar.classList.contains('open')) {
        searchInput.focus();
        if (searchOverlay) searchOverlay.classList.add('active');
      } else {
        searchResults.classList.remove('active');
        if (searchOverlay) searchOverlay.classList.remove('active');
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      performSearch(this.value);
    });
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        searchBar.classList.remove('open');
        searchResults.classList.remove('active');
        if (searchOverlay) searchOverlay.classList.remove('active');
      }
    });
  }

  if (searchOverlay) {
    searchOverlay.addEventListener('click', function () {
      searchBar.classList.remove('open');
      searchResults.classList.remove('active');
      searchOverlay.classList.remove('active');
    });
  }

  document.querySelectorAll('.search-result-item').forEach(function (item) {
    item.addEventListener('click', function () {
      searchBar.classList.remove('open');
      searchResults.classList.remove('active');
      if (searchOverlay) searchOverlay.classList.remove('active');
    });
  });

  /* Re-attach search click for dynamic results */
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('search-result-item')) {
      searchBar.classList.remove('open');
      searchResults.classList.remove('active');
      if (searchOverlay) searchOverlay.classList.remove('active');
    }
  });

  /* ==================== SERVICE MODAL ==================== */

  var modal = document.getElementById('serviceModal');
  var modalBg = document.querySelector('.service-modal-bg');
  var modalClose = document.querySelector('.service-modal-close');
  var modalIcon = document.getElementById('modalServiceIcon');
  var modalName = document.getElementById('modalServiceName');
  var modalDesc = document.getElementById('modalServiceDesc');
  var modalForm = document.getElementById('serviceForm');
  var modalSuccess = document.getElementById('modalSuccess');
  var modalSuccessClose = document.getElementById('modalSuccessClose');
  var serviceIdInput = document.getElementById('serviceId');

  function openServiceModal(serviceId) {
    var service = null;
    var servicesData = getData('services');
    if (servicesData) {
      servicesData.forEach(function (s) {
        if (s.id === serviceId) service = s;
      });
    }
    if (!service) return;
    if (modalIcon) modalIcon.textContent = service.icon;
    if (modalName) modalName.textContent = service.name;
    if (modalDesc) modalDesc.textContent = service.description;
    if (serviceIdInput) serviceIdInput.value = service.id;
    if (modalForm) modalForm.classList.remove('hidden');
    if (modalSuccess) modalSuccess.classList.remove('active');
    if (modalForm) modalForm.reset();
    if (modal) modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeServiceModal() {
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalBg) modalBg.addEventListener('click', closeServiceModal);
  if (modalClose) modalClose.addEventListener('click', closeServiceModal);

  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('btn-service-apply')) {
      var id = e.target.getAttribute('data-id');
      openServiceModal(id);
    }
  });

  if (modalForm) {
    modalForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('sName').value.trim();
      var nik = document.getElementById('sNIK').value.trim();
      var phone = document.getElementById('sPhone').value.trim();
      var address = document.getElementById('sAddress').value.trim();
      var notes = document.getElementById('sNotes').value.trim();
      var serviceId = serviceIdInput.value;

      var serviceName = '';
      var servicesData = getData('services');
      if (servicesData) {
        servicesData.forEach(function (s) {
          if (s.id === serviceId) serviceName = s.name;
        });
      }

      var submission = {
        id: Date.now(),
        serviceId: serviceId,
        serviceName: serviceName,
        name: name,
        nik: nik,
        phone: phone,
        address: address,
        notes: notes,
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        status: 'menunggu'
      };

      var existing = JSON.parse(localStorage.getItem('layananPengajuan') || '[]');
      existing.unshift(submission);
      localStorage.setItem('layananPengajuan', JSON.stringify(existing));

      if (modalForm) modalForm.classList.add('hidden');
      if (modalSuccess) modalSuccess.classList.add('active');

      var contactData = getData('contact');
      if (contactData && contactData.whatsapp_url) {
        var msg = 'PENGAJUAN LAYANAN DESA\n';
        msg += 'Layanan: ' + serviceName + '\n';
        msg += 'Nama: ' + name + '\n';
        msg += 'NIK: ' + nik + '\n';
        msg += 'No HP: ' + phone + '\n';
        msg += 'Alamat: ' + address + '\n';
        msg += 'Keterangan: ' + (notes || '-') + '\n';
        msg += 'ID: ' + submission.id;
        setTimeout(function () {
          window.open(contactData.whatsapp_url + '?text=' + encodeURIComponent(msg), '_blank');
        }, 1000);
      }

      renderStatusSidebar();
    });
  }

  if (modalSuccessClose) {
    modalSuccessClose.addEventListener('click', closeServiceModal);
  }

  /* ==================== STATUS SIDEBAR ==================== */

  var statusSidebar = document.getElementById('statusSidebar');
  var statusToggle = document.getElementById('statusToggle');
  var statusPanel = document.querySelector('.status-sidebar-panel');
  var statusClose = document.getElementById('statusClose');
  var statusBody = document.getElementById('statusBody');

  function renderStatusSidebar() {
    var submissions = JSON.parse(localStorage.getItem('layananPengajuan') || '[]');
    if (!statusBody) return;
    if (submissions.length === 0) {
      statusBody.innerHTML = '<div class="status-empty">Belum ada pengajuan.</div>';
      return;
    }
    statusBody.innerHTML = submissions.map(function (s) {
      var badgeClass = s.status === 'menunggu' ? 'menunggu' : s.status === 'diproses' ? 'diproses' : 'selesai';
      var badgeLabel = s.status === 'menunggu' ? 'Menunggu' : s.status === 'diproses' ? 'Diproses' : 'Selesai';
      return '<div class="status-item">' +
        '<div class="status-item-header">' +
        '<span class="status-item-name">' + s.name + '</span>' +
        '<span class="status-item-badge ' + badgeClass + '">' + badgeLabel + '</span>' +
        '</div>' +
        '<div class="status-item-service">' + s.serviceName + '</div>' +
        '<div class="status-item-date">' + s.date + ' &middot; ID: ' + s.id + '</div>' +
        '</div>';
    }).join('');
  }

  if (statusToggle) {
    statusToggle.addEventListener('click', function () {
      if (statusPanel) {
        statusPanel.classList.toggle('open');
        renderStatusSidebar();
      }
    });
  }

  if (statusClose) {
    statusClose.addEventListener('click', function () {
      if (statusPanel) statusPanel.classList.remove('open');
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (modal && modal.classList.contains('active')) closeServiceModal();
      if (statusPanel && statusPanel.classList.contains('open')) statusPanel.classList.remove('open');
    }
  });

  renderStatusSidebar();

});
