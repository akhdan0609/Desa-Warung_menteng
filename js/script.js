document.addEventListener('DOMContentLoaded', function () {

  if (typeof siteData === 'undefined' || !siteData) return;
  var data = siteData;
  var page = window.location.pathname.split('/').pop() || 'index.html';

  function getStore(key) { return JSON.parse(localStorage.getItem('edit_' + key) || 'null'); }
  function getData(key) { var s = getStore(key); return s !== null ? s : (data[key] || null); }

  /* NAV */
  var navList = document.getElementById('nav-links');
  if (navList && data.nav) {
    navList.innerHTML = data.nav.map(function (item) {
      var href = item.href;
      var active = href === page || (page === '' && href === 'index.html') ? ' active' : '';
      var a = '<a href="' + href + '" class="nav-link' + active + '">' + item.label + '</a>';
      if (item.submenu && item.submenu.length > 0) {
        var sub = item.submenu.map(function (s) {
          var sa = s.href === page || (page === '' && s.href === 'index.html') ? ' active' : '';
          return '<li><a href="' + s.href + '" class="nav-link' + sa + '">' + s.label + '</a></li>';
        }).join('');
        return '<li class="nav-dropdown">' + a + '<ul class="submenu">' + sub + '</ul></li>';
      }
      return '<li>' + a + '</li>';
    }).join('');
  }

  /* HERO IMAGE OVERRIDE */
  var heroImg = document.getElementById('heroBgImg');
  var savedHeroImg = localStorage.getItem('edit_img_hero');
  if (savedHeroImg && savedHeroImg.indexOf('photo-1506905925346') > -1) {
    localStorage.removeItem('edit_img_hero');
    savedHeroImg = null;
  }
  if (heroImg) {
    heroImg.src = savedHeroImg && savedHeroImg.trim() !== ''
      ? savedHeroImg
      : 'https://images.unsplash.com/photo-1759574981176-2ccab9970471?w=1200&q=80';
  }

  /* ==================== PAGE-SPECIFIC RENDERING ==================== */

  var pageHandlers = {
    'tentang.html': function () {
      renderPageHeader('Profil Desa', 'Informasi lengkap Desa Warung Menteng');
      renderAbout(); renderPerangkat(); renderStruktur(); renderAnggaran();
      renderTentangContact(); renderTentangLokasi(); renderServices();
    },
    'pariwisata.html': function () {
      renderPageHeader('Pariwisata', 'Jelajahi destinasi, kuliner, dan UMKM Desa Warung Menteng');
      renderCards('destinationsGrid', getData('destinations'), 'destination');
      renderCards('culinaryGrid', getData('culinary'), 'culinary');
      renderCards('accommodationGrid', getData('accommodation'), 'accommodation');
      renderUMKM();
    },
    'profil.html': function () { renderPageHeader('Profil Desa', 'Profil dan sejarah Desa Warung Menteng'); renderAbout(); },
    'perangkat.html': function () { renderPageHeader('Perangkat Desa', 'Aparatur Desa Warung Menteng'); renderPerangkat(); },
    'struktur.html': function () { renderPageHeader('Struktur Organisasi', 'Struktur pemerintahan Desa Warung Menteng'); renderStruktur(); },
    'anggaran.html': function () { renderPageHeader('Anggaran Desa', 'APBDes Desa Warung Menteng'); renderAnggaran(); },
    'lokasi.html': function () { renderPageHeader('Lokasi & Kontak', 'Alamat dan kontak Desa Warung Menteng'); renderTentangContact(); renderTentangLokasi(); },
    'berita.html': function () { renderPageHeader('Berita', 'Informasi terbaru dari Desa Warung Menteng'); renderNews(); },
    'destinasi.html': function () { renderPageHeader('Destinasi', 'Destinasi wisata Desa Warung Menteng'); renderCards('destinationsGrid', getData('destinations'), 'destination'); },
    'kuliner.html': function () { renderPageHeader('Kuliner', 'Kuliner khas Desa Warung Menteng'); renderCards('culinaryGrid', getData('culinary'), 'culinary'); },
    'akomodasi.html': function () { renderPageHeader('Akomodasi', 'Tempat menginap di Desa Warung Menteng'); renderCards('accommodationGrid', getData('accommodation'), 'accommodation'); },
    'umkm.html': function () { renderPageHeader('UMKM', 'Produk UMKM Desa Warung Menteng'); renderUMKM(); },
    'galeri.html': function () { renderPageHeader('Galeri', 'Foto-foto Desa Warung Menteng'); renderGallery(); },
    'layanan.html': function () { renderPageHeader('Layanan Desa', 'Ajukan surat keterangan secara online'); renderServices(); },
    'artikel.html': function () { renderArtikel(); }
  };

  if (pageHandlers[page]) pageHandlers[page]();

  if (page === 'index.html' || page === '') {
    renderHero();
    renderAbout();
    renderTestimonials();
    renderEvents();
  }

  renderFooter();
  renderStatusSidebar();

  /* ==================== RENDER FUNCTIONS ==================== */

  function renderPageHeader(title, desc) {
    var el = document.getElementById('pageHeaderTitle');
    var elDesc = document.getElementById('pageHeaderDesc');
    if (el) el.textContent = title;
    if (elDesc) elDesc.textContent = desc;
  }

  function renderHero() {
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
  }

  function renderAbout() {
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
  }

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
          '<div class="press-category">' + item.category + '</div>' +
          '<h3>' + item.title + '</h3>' +
          '<p>' + item.excerpt + '</p>' +
          '<a href="artikel.html?id=' + item.id + '" class="press-link">Baca Selengkapnya &rarr;</a>' +
        '</div></div>';
    }).join('');
  }

  function renderArtikel() {
    var params = new URLSearchParams(window.location.search);
    var id = parseInt(params.get('id'), 10);
    var newsData = getData('news');
    var artikel = null;
    if (newsData) newsData.forEach(function (item) { if (item.id === id) artikel = item; });
    var titleEl = document.getElementById('artikelTitle');
    var dateEl = document.getElementById('artikelDate');
    var catEl = document.getElementById('artikelCategory');
    var bodyEl = document.getElementById('artikelBody');
    var contentEl = document.getElementById('artikelContent');
    var notFoundEl = document.getElementById('artikelNotFound');
    if (!artikel) {
      if (contentEl) contentEl.style.display = 'none';
      if (notFoundEl) notFoundEl.style.display = 'block';
      return;
    }
    if (titleEl) titleEl.textContent = artikel.title;
    if (dateEl) dateEl.textContent = artikel.date;
    if (catEl) catEl.textContent = artikel.category;
    if (bodyEl) bodyEl.innerHTML = artikel.content || '<p>' + artikel.excerpt + '</p>';
    document.title = artikel.title + ' — Desa Warung Menteng';
  }

  function renderCards(gridId, items, type) {
    var grid = document.getElementById(gridId);
    if (!grid || !items) return;
    grid.innerHTML = items.map(function (item) {
      return '<div class="card reveal" data-id="' + item.id + '" data-type="' + (type || gridId) + '">' +
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
    var categories = getData('serviceCategories');
    if (!grid || !servicesData) return;
    var html = '';
    if (categories) {
      categories.forEach(function (cat) {
        var catServices = servicesData.filter(function (s) { return s.category === cat.id; });
        if (catServices.length === 0) return;
        html += '<div class="service-category reveal"><h3 class="service-category-title">' + cat.name + '</h3><div class="service-category-grid">';
        html += catServices.map(function (item) {
          return '<div class="service-card">' +
            '<div class="service-icon">' + item.icon + '</div>' +
            '<h3>' + item.name + '</h3>' +
            '<p>' + item.description + '</p>' +
            '<div class="service-req"><strong>Persyaratan:</strong> ' + item.requirements + '</div>' +
            '<div class="service-actions">' +
            '<button class="btn btn-primary btn-service-apply" data-id="' + item.id + '">Ajukan Online</button>' +
            '<button class="btn btn-outline btn-service-print" data-id="' + item.id + '">Cetak</button>' +
            '</div></div>';
        }).join('');
        html += '</div></div>';
      });
    } else {
      html = servicesData.map(function (item) {
        return '<div class="service-card">' +
          '<div class="service-icon">' + item.icon + '</div>' +
          '<h3>' + item.name + '</h3>' +
          '<p>' + item.description + '</p>' +
          '<div class="service-req"><strong>Persyaratan:</strong> ' + item.requirements + '</div>' +
          '<div class="service-actions">' +
          '<button class="btn btn-primary btn-service-apply" data-id="' + item.id + '">Ajukan Online</button>' +
          '<button class="btn btn-outline btn-service-print" data-id="' + item.id + '">Cetak</button>' +
          '</div></div>';
      }).join('');
    }
    grid.innerHTML = html;
  }

  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('btn-service-print')) {
      var serviceId = e.target.getAttribute('data-id');
      var servicesData = getData('services');
      var service = null;
      if (servicesData) servicesData.forEach(function (s) { if (s.id === serviceId) service = s; });
      if (!service) return;
      var printWin = window.open('', '_blank');
      printWin.document.write('<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><title>Cetak - ' + service.name + '</title>' +
        '<style>' +
        'body { font-family: "Outfit", Arial, sans-serif; padding: 48px; max-width: 700px; margin: 0 auto; color: #1a1a1a; }' +
        '.header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #1a1a1a; padding-bottom: 24px; }' +
        '.header h1 { font-size: 1.6rem; margin-bottom: 4px; }' +
        '.header p { font-size: 0.85rem; color: #555; }' +
        '.info-table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }' +
        '.info-table td { padding: 12px 16px; border: 1px solid #ddd; vertical-align: top; font-size: 0.9rem; }' +
        '.info-table td:first-child { font-weight: 700; width: 160px; background: #f5f5f5; }' +
        '.footer { text-align: center; font-size: 0.8rem; color: #888; margin-top: 48px; padding-top: 16px; border-top: 1px solid #ddd; }' +
        '.stamp { margin-top: 48px; text-align: right; }' +
        '.stamp .line { margin-top: 60px; width: 200px; border-top: 1px solid #000; display: inline-block; }' +
        '@media print { body { padding: 24px; } }' +
        '</style></head><body>' +
        '<div class="header"><h1>' + service.name + '</h1><p>Desa Warung Menteng, Kecamatan Cijeruk, Kabupaten Bogor</p></div>' +
        '<table class="info-table">' +
        '<tr><td>Nama Layanan</td><td>' + service.name + '</td></tr>' +
        '<tr><td>Deskripsi</td><td>' + service.description + '</td></tr>' +
        '<tr><td>Persyaratan</td><td>' + service.requirements + '</td></tr>' +
        '</table>' +
        '<div class="footer">Dokumen ini dicetak dari Sistem Layanan Desa Warung Menteng &bull; ' + new Date().toLocaleDateString('id-ID') + '</div>' +
        '<div class="stamp"><div>Kepala Desa Warung Menteng</div><div class="line"></div></div>' +
        '</body></html>');
      printWin.document.close();
      printWin.focus();
      setTimeout(function () { printWin.print(); }, 500);
    }
  });

  function renderUMKM() {
    var grid = document.getElementById('umkmGrid');
    var umkmData = getData('umkm');
    if (!grid || !umkmData) return;
    grid.innerHTML = umkmData.map(function (item) {
      var waUrl = item.contact ? 'https://wa.me/' + item.contact.replace(/[^0-9]/g, '') : '';
      var waBtn = waUrl ? '<a href="' + waUrl + '" target="_blank" rel="noopener" class="umkm-wa" onclick="event.stopPropagation();">Hubungi via WhatsApp</a>' : '';
      return '<div class="umkm-card reveal" data-id="' + item.id + '" data-type="umkm">' +
        '<div class="umkm-icon">' + item.icon + '</div>' +
        '<div class="umkm-body">' +
        '<h3>' + item.name + '</h3>' +
        '<p>' + item.description + '</p>' +
        '<div class="umkm-owner">\u2714 ' + item.owner + '</div>' +
        waBtn +
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
    grid.innerHTML = perangkatData.map(function (item, idx) {
      return '<div class="perangkat-card reveal" data-idx="' + idx + '" data-type="perangkat">' +
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

  function renderTentangLokasi() {
    var container = document.getElementById('tentangAddress');
    var mapsLink = document.getElementById('tentangMapsLink');
    var mapsLink2 = document.getElementById('tentangMapsLink2');
    var contactData = getData('contact');
    if (container && contactData) container.textContent = contactData.address;
    if (mapsLink && contactData) mapsLink.href = contactData.maps_url;
    if (mapsLink2 && contactData) mapsLink2.href = contactData.maps_url;
  }

  /* ==================== EXISTING FEATURES ==================== */

  /* HEADER SCROLL */
  var header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  /* HAMBURGER */
  var hamburger = document.querySelector('.hamburger');
  var navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('.nav-dropdown > a').forEach(function (link) {
      link.addEventListener('click', function (e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          this.parentNode.classList.toggle('open');
        }
      });
    });
    navLinks.querySelectorAll(':scope > li > a:not(.nav-dropdown > a), .submenu a').forEach(function (link) {
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
        name: name, email: email, subject: subject, message: message,
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      };
      var existing = JSON.parse(localStorage.getItem('pesanKontak') || '[]');
      existing.unshift(msg);
      localStorage.setItem('pesanKontak', JSON.stringify(existing));
      var btn = this.querySelector('button[type="submit"]');
      btn.textContent = '\u2713 Pesan Terkirim!';
      btn.style.background = '#059669';
      setTimeout(function () {
        btn.textContent = 'Kirim Pesan';
        btn.style.background = '';
      }, 3000);
      this.reset();
    });
  }

  /* ==================== SEARCH ==================== */

  var searchToggle = document.getElementById('searchToggle');
  var searchBar = document.getElementById('searchBar');
  var searchInput = document.getElementById('searchInput');
  var searchResults = document.getElementById('searchResults');
  var searchOverlay = document.getElementById('searchOverlay');

  var searchData = [];

  function buildSearchIndex() {
    searchData = [];
    var umkmData = getData('umkm');
    if (umkmData) umkmData.forEach(function (item) { searchData.push({ type: 'UMKM', title: item.name, desc: item.description, href: 'umkm.html', tag: item.owner }); });
    var destData = getData('destinations');
    if (destData) destData.forEach(function (item) { searchData.push({ type: 'Destinasi', title: item.name, desc: item.description, href: 'destinasi.html', tag: item.tag }); });
    var culinaryData = getData('culinary');
    if (culinaryData) culinaryData.forEach(function (item) { searchData.push({ type: 'Kuliner', title: item.name, desc: item.description, href: 'kuliner.html', tag: item.tag }); });
    var accomData = getData('accommodation');
    if (accomData) accomData.forEach(function (item) { searchData.push({ type: 'Penginapan', title: item.name, desc: item.description, href: 'akomodasi.html', tag: item.tag }); });
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
    searchInput.addEventListener('input', function () { performSearch(this.value); });
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

  var lastSubmission = null;

  function openServiceModal(serviceId) {
    var service = null;
    var servicesData = getData('services');
    if (servicesData) servicesData.forEach(function (s) { if (s.id === serviceId) service = s; });
    if (!service) return;
    if (modalIcon) modalIcon.textContent = service.icon;
    if (modalName) modalName.textContent = service.name;
    if (modalDesc) modalDesc.textContent = service.description;
    if (serviceIdInput) serviceIdInput.value = service.id;
    if (modalForm) { modalForm.classList.remove('hidden'); modalForm.reset(); }
    if (modalSuccess) modalSuccess.classList.remove('active');
    var existingPrintBtn = document.getElementById('modalPrintInfo');
    if (!existingPrintBtn && modalDesc && modalDesc.parentNode) {
      var printBtn = document.createElement('button');
      printBtn.id = 'modalPrintInfo';
      printBtn.className = 'btn btn-outline';
      printBtn.textContent = 'Cetak Info Layanan';
      printBtn.style.cssText = 'width:100%;justify-content:center;margin-bottom:20px;padding:12px;font-size:0.7rem;';
      printBtn.addEventListener('click', function () {
        printServiceInfo(service);
      });
      modalDesc.parentNode.insertBefore(printBtn, modalDesc.nextSibling);
    } else if (existingPrintBtn) {
      existingPrintBtn.style.display = '';
      existingPrintBtn.onclick = function () { printServiceInfo(service); };
    }
    if (modal) modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function printServiceInfo(service) {
    if (!service) return;
    var catName = '';
    var categories = getData('serviceCategories');
    if (categories) categories.forEach(function (c) { if (c.id === service.category) catName = c.name; });
    var now = new Date();
    var dateStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    var timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    var win = window.open('', '_blank');
    win.document.write('<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><title>Cetak - ' + service.name + '</title>' +
      '<style>' +
      'body { font-family: "Outfit", Arial, sans-serif; padding: 48px; max-width: 700px; margin: 0 auto; color: #1a1a1a; }' +
      '.header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #1a1a1a; padding-bottom: 24px; }' +
      '.header .logo-text { font-size: 1.2rem; font-weight: 800; letter-spacing: -0.5px; }' +
      '.header .sub { font-size: 0.8rem; color: #555; margin-top: 4px; }' +
      '.header h1 { font-size: 1.4rem; margin-top: 16px; margin-bottom: 4px; }' +
      '.info-table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }' +
      '.info-table td { padding: 12px 16px; border: 1px solid #ddd; vertical-align: top; font-size: 0.9rem; }' +
      '.info-table td:first-child { font-weight: 700; width: 160px; background: #f5f5f5; }' +
      '.footer { text-align: center; font-size: 0.75rem; color: #888; margin-top: 48px; padding-top: 16px; border-top: 1px solid #ddd; }' +
      '.meta { font-size: 0.75rem; color: #888; text-align: right; margin-bottom: 24px; }' +
      '@media print { body { padding: 24px; } }' +
      '</style></head><body>' +
      '<div class="meta">Dicetak: ' + dateStr + ' pukul ' + timeStr + '</div>' +
      '<div class="header"><div class="logo-text">Desa Warung Menteng</div><div class="sub">Kecamatan Cijeruk, Kabupaten Bogor</div><h1>' + service.name + '</h1></div>' +
      '<table class="info-table">' +
      '<tr><td>Nama Layanan</td><td>' + service.name + '</td></tr>' +
      (catName ? '<tr><td>Kategori</td><td>' + catName + '</td></tr>' : '') +
      '<tr><td>Deskripsi</td><td>' + service.description + '</td></tr>' +
      '<tr><td>Persyaratan</td><td>' + service.requirements + '</td></tr>' +
      '</table>' +
      '<p style="font-size:0.85rem;line-height:1.7;">Ajukan layanan ini secara online melalui website resmi Desa Warung Menteng atau datang langsung ke Kantor Desa dengan membawa persyaratan yang diperlukan.</p>' +
      '<div class="footer">Dokumen ini dicetak dari Sistem Layanan Desa Warung Menteng &mdash; ' + dateStr + '</div>' +
      '</body></html>');
    win.document.close();
    win.focus();
    setTimeout(function () { win.print(); }, 500);
  }

  function printSubmissionReceipt(submission) {
    if (!submission) return;
    var now = new Date();
    var dateStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    var timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    var win = window.open('', '_blank');
    win.document.write('<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><title>Bukti Pengajuan - ' + submission.serviceName + '</title>' +
      '<style>' +
      'body { font-family: "Outfit", Arial, sans-serif; padding: 48px; max-width: 700px; margin: 0 auto; color: #1a1a1a; }' +
      '.header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #1a1a1a; padding-bottom: 24px; }' +
      '.header .logo-text { font-size: 1.2rem; font-weight: 800; }' +
      '.header .sub { font-size: 0.8rem; color: #555; }' +
      '.header h2 { font-size: 1.1rem; margin-top: 16px; margin-bottom: 4px; }' +
      '.badge { display: inline-block; padding: 4px 16px; font-size: 0.7rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; background: #f0f0f0; margin-top: 8px; }' +
      '.info-table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }' +
      '.info-table td { padding: 10px 14px; border: 1px solid #ddd; vertical-align: top; font-size: 0.85rem; }' +
      '.info-table td:first-child { font-weight: 700; width: 140px; background: #f5f5f5; }' +
      '.footer { text-align: center; font-size: 0.75rem; color: #888; margin-top: 48px; padding-top: 16px; border-top: 1px solid #ddd; }' +
      '.meta { font-size: 0.75rem; color: #888; text-align: right; margin-bottom: 24px; }' +
      '@media print { body { padding: 24px; } }' +
      '</style></head><body>' +
      '<div class="meta">Dicetak: ' + dateStr + ' pukul ' + timeStr + '</div>' +
      '<div class="header"><div class="logo-text">Desa Warung Menteng</div><div class="sub">Kecamatan Cijeruk, Kabupaten Bogor</div><h2>BUKTI PENGAJUAN LAYANAN</h2><div class="badge">' + (submission.status === 'menunggu' ? 'Menunggu' : submission.status === 'diproses' ? 'Diproses' : 'Selesai') + '</div></div>' +
      '<table class="info-table">' +
      '<tr><td>ID Pengajuan</td><td>' + submission.id + '</td></tr>' +
      '<tr><td>Layanan</td><td>' + submission.serviceName + '</td></tr>' +
      '<tr><td>Nama Lengkap</td><td>' + submission.name + '</td></tr>' +
      '<tr><td>NIK</td><td>' + submission.nik + '</td></tr>' +
      '<tr><td>No. HP</td><td>' + submission.phone + '</td></tr>' +
      '<tr><td>Alamat</td><td>' + submission.address + '</td></tr>' +
      (submission.notes ? '<tr><td>Keterangan</td><td>' + submission.notes + '</td></tr>' : '') +
      '<tr><td>Tanggal Pengajuan</td><td>' + submission.date + '</td></tr>' +
      '</table>' +
      '<p style="font-size:0.85rem;color:#555;text-align:center;">Simpan bukti ini sebagai referensi untuk mengecek status pengajuan Anda.</p>' +
      '<div class="footer">Dokumen ini dicetak dari Sistem Layanan Desa Warung Menteng &mdash; ' + dateStr + '</div>' +
      '</body></html>');
    win.document.close();
    win.focus();
    setTimeout(function () { win.print(); }, 500);
  }

  function closeServiceModal() {
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (modalBg) modalBg.addEventListener('click', closeServiceModal);
  if (modalClose) modalClose.addEventListener('click', closeServiceModal);

  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('btn-service-apply')) {
      openServiceModal(e.target.getAttribute('data-id'));
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
      if (servicesData) servicesData.forEach(function (s) { if (s.id === serviceId) serviceName = s.name; });
      var submission = {
        id: Date.now(), serviceId: serviceId, serviceName: serviceName,
        name: name, nik: nik, phone: phone, address: address, notes: notes,
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        status: 'menunggu'
      };
      lastSubmission = submission;
      var existing = JSON.parse(localStorage.getItem('layananPengajuan') || '[]');
      existing.unshift(submission);
      localStorage.setItem('layananPengajuan', JSON.stringify(existing));
      if (modalForm) modalForm.classList.add('hidden');
      if (modalSuccess) {
        var detailHtml = '<div style="text-align:left;background:#f9faf9;padding:16px;border-radius:8px;margin:16px 0;font-size:0.8rem;line-height:1.8;">' +
          '<div><strong>Layanan:</strong> ' + submission.serviceName + '</div>' +
          '<div><strong>Nama:</strong> ' + submission.name + '</div>' +
          '<div><strong>ID:</strong> ' + submission.id + '</div>' +
          '<div><strong>Tanggal:</strong> ' + submission.date + '</div></div>';
        var existingDetail = modalSuccess.querySelector('.submission-detail');
        if (existingDetail) existingDetail.outerHTML = detailHtml;
        else {
          var descP = modalSuccess.querySelector('p');
          if (descP) descP.insertAdjacentHTML('afterend', detailHtml);
        }
        modalSuccess.classList.add('active');
      }
      var receiptBtn = document.getElementById('modalPrintReceipt');
      if (!receiptBtn) {
        receiptBtn = document.createElement('button');
        receiptBtn.id = 'modalPrintReceipt';
        receiptBtn.className = 'btn btn-outline';
        receiptBtn.textContent = 'Cetak Bukti Pengajuan';
        receiptBtn.style.cssText = 'width:100%;justify-content:center;margin-top:12px;padding:12px;font-size:0.7rem;';
        receiptBtn.addEventListener('click', function () {
          printSubmissionReceipt(lastSubmission);
        });
        var successClose = document.getElementById('modalSuccessClose');
        if (successClose && successClose.parentNode) {
          successClose.parentNode.insertBefore(receiptBtn, successClose.nextSibling);
        }
      } else {
        receiptBtn.style.display = '';
      }
      var contactData = getData('contact');
      if (contactData && contactData.whatsapp_url) {
        var msg = 'PENGAJUAN LAYANAN DESA\nLayanan: ' + serviceName + '\nNama: ' + name + '\nNIK: ' + nik + '\nNo HP: ' + phone + '\nAlamat: ' + address + '\nKeterangan: ' + (notes || '-') + '\nID: ' + submission.id;
        setTimeout(function () { window.open(contactData.whatsapp_url + '?text=' + encodeURIComponent(msg), '_blank'); }, 1000);
      }
      renderStatusSidebar();
    });
  }

  if (modalSuccessClose) {
    modalSuccessClose.addEventListener('click', closeServiceModal);
  }

  /* ==================== DETAIL MODAL ==================== */

  var detailModal = document.getElementById('detailModal');
  var detailModalBg = document.getElementById('detailModalBg');
  var detailModalClose = document.getElementById('detailModalClose');
  var detailBtnClose = document.getElementById('detailBtnClose');
  var detailIcon = document.getElementById('detailIcon');
  var detailTitle = document.getElementById('detailTitle');
  var detailTag = document.getElementById('detailTag');
  var detailDesc = document.getElementById('detailDesc');
  var detailFields = document.getElementById('detailFields');

  function openDetailModal(data) {
    if (!detailModal) return;
    if (detailIcon) detailIcon.textContent = data.icon || '';
    if (detailTitle) detailTitle.textContent = data.name || data.title || '';
    if (detailTag) detailTag.textContent = data.tag || data.jabatan || data.type || '';
    if (detailDesc) detailDesc.textContent = data.description || data.desc || '';
    if (detailFields) {
      var fields = data.fields || [];
      detailFields.innerHTML = fields.map(function (f) {
        return '<div class="detail-field">' +
          '<div class="field-icon">' + (f.icon || '') + '</div>' +
          '<div><div class="field-label">' + f.label + '</div>' +
          '<div class="field-value">' + f.value + '</div></div></div>';
      }).join('');
    }
    detailModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDetailModal() {
    if (detailModal) detailModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (detailModalBg) detailModalBg.addEventListener('click', closeDetailModal);
  if (detailModalClose) detailModalClose.addEventListener('click', closeDetailModal);
  if (detailBtnClose) detailBtnClose.addEventListener('click', closeDetailModal);

  document.addEventListener('click', function (e) {
    var card = e.target.closest('.card, .umkm-card, .perangkat-card');
    if (!card) return;
    var type = card.getAttribute('data-type');
    var id = card.getAttribute('data-id');
    var idx = card.getAttribute('data-idx');
    var item = null;

    if (type === 'destination') {
      var dests = getData('destinations');
      if (dests) dests.forEach(function (d) { if (String(d.id) === id) item = d; });
    } else if (type === 'culinary') {
      var culs = getData('culinary');
      if (culs) culs.forEach(function (d) { if (String(d.id) === id) item = d; });
    } else if (type === 'accommodation') {
      var accs = getData('accommodation');
      if (accs) accs.forEach(function (d) { if (String(d.id) === id) item = d; });
    } else if (type === 'umkm') {
      var umkms = getData('umkm');
      if (umkms) umkms.forEach(function (d) { if (String(d.id) === id) item = d; });
    } else if (type === 'perangkat') {
      var perangkat = getData('perangkat_desa');
      if (perangkat && perangkat[idx]) item = perangkat[idx];
    }

    if (!item) return;

    var detailData = {
      icon: item.icon || '',
      name: item.name || item.nama || '',
      tag: item.tag || item.jabatan || '',
      description: item.description || '',
      fields: []
    };

    if (type === 'umkm') {
      detailData.fields.push({ icon: '\uD83D\uDC64', label: 'Pemilik', value: item.owner || '-' });
      if (item.contact) detailData.fields.push({ icon: '\uD83D\uDCDE', label: 'Kontak', value: item.contact });
    } else if (type === 'perangkat') {
      detailData.fields.push({ icon: '\uD83D\uDC64', label: 'Nama', value: item.nama || '-' });
      detailData.fields.push({ icon: '\uD83D\uDCBC', label: 'Jabatan', value: item.jabatan || '-' });
      detailData.fields.push({ icon: '\uD83D\uDCCB', label: 'Bidang', value: item.bidang || '-' });
    } else {
      detailData.fields.push({ icon: '\uD83C\uDFD4\uFE0F', label: 'Kategori', value: item.tag || '-' });
    }

    openDetailModal(detailData);
  });

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
    statusClose.addEventListener('click', function () { if (statusPanel) statusPanel.classList.remove('open'); });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (modal && modal.classList.contains('active')) closeServiceModal();
      if (detailModal && detailModal.classList.contains('active')) closeDetailModal();
      if (statusPanel && statusPanel.classList.contains('open')) statusPanel.classList.remove('open');
    }
  });

});
