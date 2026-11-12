/* /domains: three steps on one page (field, kind of organization, check and start).
   The address hash keeps the place, so the back button and shared links work:
   (none) = step 1, #<group> = step 2, #<group>/<pack> = step 3. A group with one pack skips step 2. */
(function () {
  var root = document.getElementById('dc');
  if (!root) return;
  var views = [].slice.call(root.querySelectorAll('.dc-view'));
  var steps = [].slice.call(root.querySelectorAll('.dc-step'));
  var groups = {}, packs = {};
  root.querySelectorAll('.dc-tile').forEach(function (t) {
    groups[t.dataset.group] = { title: t.querySelector('.dc-tn').textContent.trim(), only: t.dataset.only || null };
  });
  root.querySelectorAll('.dc-view[data-step="3"]').forEach(function (v) {
    packs[v.dataset.domain] = { group: v.dataset.group, name: v.dataset.name };
  });

  function parse() {
    var parts = decodeURIComponent(location.hash.slice(1)).split('/');
    var g = parts[0], d = parts[1];
    // A group id wins over a pack slug of the same name (justice and education are both).
    if (g && !d && !groups[g] && packs[g]) return { step: 3, group: packs[g].group, domain: g };
    if (!g || !groups[g]) return { step: 1 };
    if (d && packs[d] && packs[d].group === g) return { step: 3, group: g, domain: d };
    if (groups[g].only) return { step: 3, group: g, domain: groups[g].only };
    return { step: 2, group: g };
  }

  function render(focus) {
    var s = parse();
    var shown = null;
    views.forEach(function (v) {
      var on = Number(v.dataset.step) === s.step &&
        (s.step === 1 || (s.step === 2 && v.dataset.group === s.group) || (s.step === 3 && v.dataset.domain === s.domain));
      v.hidden = !on;
      if (on) shown = v;
    });
    var single = Boolean(s.group && groups[s.group].only);
    var values = ['', '', ''];
    if (s.step > 1) values[0] = groups[s.group].title;
    if (s.step === 3) values[1] = single ? 'ไม่ต้องเลือก' : packs[s.domain].name;
    steps.forEach(function (b, i) {
      var n = i + 1;
      var done = n < s.step && !(n === 2 && single);
      b.classList.toggle('is-now', n === s.step);
      b.classList.toggle('is-done', Boolean(done || (n === 2 && single && s.step === 3)));
      b.querySelector('.dc-dot').innerHTML = (b.classList.contains('is-done')) ? '<i class="bi bi-check-lg" aria-hidden="true"></i>' : String(n);
      b.querySelector('.dc-sv').textContent = values[i];
      if (n === s.step) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
      var clickable = done;
      b.setAttribute('aria-disabled', clickable ? 'false' : 'true');
      b.tabIndex = clickable || n === s.step ? 0 : -1;
    });
    if (focus && shown) {
      var h = shown.querySelector('.dc-q');
      window.scrollTo(0, 0);
      if (h) h.focus({ preventScroll: true });
    }
  }

  function nav(hash) {
    history.pushState(null, '', location.pathname + location.search + (hash ? '#' + hash : ''));
    render(true);
  }

  root.addEventListener('click', function (e) {
    var t = e.target.closest('.dc-tile, .dc-opt, .dc-step, .dc-back, [data-notice]');
    if (!t) return;
    var s = parse();
    if (t.matches('.dc-tile')) {
      var g = t.dataset.group;
      nav(t.dataset.only ? g + '/' + t.dataset.only : g);
    } else if (t.matches('.dc-opt')) {
      nav(s.group + '/' + t.dataset.domain);
    } else if (t.matches('.dc-step')) {
      if (t.getAttribute('aria-disabled') === 'true') return;
      var n = Number(t.dataset.go);
      nav(n === 1 ? '' : s.group);
    } else if (t.matches('.dc-back')) {
      var single = Boolean(groups[s.group] && groups[s.group].only);
      nav(t.dataset.back === 'prev' && !single ? s.group : '');
    } else {
      var box = document.getElementById(t.getAttribute('data-notice'));
      var open = box.hidden;
      box.hidden = !open;
      t.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
  });
  window.addEventListener('popstate', function () { render(true); });
  render(false);
})();
