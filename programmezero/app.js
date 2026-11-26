(function () {
  // Your Substack publication subdomain, e.g. "programmezero" for programmezero.substack.com.
  // Leave empty to show a "signups open soon" message until the publication exists.
  var SUBSTACK = "";
  var SUBSCRIBE_URL = SUBSTACK ? "https://" + SUBSTACK + ".substack.com/api/v1/free?nojs=true" : "";
  var PAGE_SIZE = 10;

  var issues = window.PZ_ISSUES || [];
  var cards = document.getElementById("cards");
  var q = document.getElementById("q");
  var empty = document.getElementById("empty");
  var pager = document.getElementById("pager");
  var page = 1;

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function fmt(d) {
    return new Date(d + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }

  function render() {
    var term = q.value.trim().toLowerCase();
    var list = issues.filter(function (i) {
      return !term || (i.title + " " + i.summary + " " + i.topics.join(" ")).toLowerCase().indexOf(term) >= 0;
    });
    var pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    if (page > pages) page = pages;
    var slice = list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    cards.innerHTML = slice.map(function (i) {
      return '<a class="card" href="' + esc(i.url) + '"><div class="thumb" aria-hidden="true"><span class="bars"><i></i><i></i><i></i><i></i></span><em>Issue</em><b>' + i.n + "</b></div>" +
        '<div class="card-body"><div class="card-date">' + fmt(i.date) + " &middot; " + esc(i.topics.join(", ")) + "</div>" +
        "<h3>" + esc(i.title) + "</h3><p>" + esc(i.summary) + "</p>" +
        '<div class="card-by"><img src="images/favicon.png" alt="" width="22" height="22">Programme Zero</div></div></a>';
    }).join("");
    empty.hidden = list.length > 0;
    renderPager(pages);
  }

  function renderPager(pages) {
    pager.hidden = pages <= 1;
    if (pages <= 1) { pager.innerHTML = ""; return; }
    var h = '<button type="button" data-p="1"' + (page === 1 ? " disabled" : "") + ">First</button>" +
      '<button type="button" data-p="' + (page - 1) + '"' + (page === 1 ? " disabled" : "") + ">Back</button>";
    for (var p = 1; p <= pages; p++) h += '<button type="button" data-p="' + p + '"' + (p === page ? ' aria-current="page"' : "") + ">" + p + "</button>";
    h += '<button type="button" data-p="' + (page + 1) + '"' + (page === pages ? " disabled" : "") + ">Next</button>" +
      '<button type="button" data-p="' + pages + '"' + (page === pages ? " disabled" : "") + ">Last</button>";
    pager.innerHTML = h;
  }
  pager.addEventListener("click", function (e) {
    var b = e.target.closest("button[data-p]"); if (!b || b.disabled) return;
    page = +b.getAttribute("data-p"); render();
    document.getElementById("archive").scrollIntoView();
  });
  q.addEventListener("input", function () { page = 1; render(); });
  render();

  // Signup forms
  [].forEach.call(document.querySelectorAll("[data-signup]"), function (form) {
    var note = form.parentNode.querySelector("[data-signup-note]");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = form.elements.email.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        note.className = "form-note err"; note.textContent = "Please enter a valid email address."; return;
      }
      if (!SUBSCRIBE_URL) {
        note.className = "form-note"; note.textContent = "Signups open soon. Check back shortly."; return;
      }
      note.className = "form-note"; note.textContent = "Subscribing...";
      fetch(SUBSCRIBE_URL, { method: "POST", body: new URLSearchParams({ email: email }), mode: "no-cors" })
        .then(function () { note.className = "form-note ok"; note.textContent = "You're in. Check your inbox to confirm."; form.reset(); })
        .catch(function () { note.className = "form-note err"; note.textContent = "Something went wrong. Please try again."; });
    });
  });

  // Sign in goes to the Substack publication once it exists
  [].forEach.call(document.querySelectorAll("[data-substack-signin]"), function (a) {
    if (SUBSTACK) { a.href = "https://" + SUBSTACK + ".substack.com/"; } else { a.addEventListener("click", function (e) { e.preventDefault(); }); }
  });

  // Placeholder links that are not live yet
  [].forEach.call(document.querySelectorAll("a[data-todo]"), function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); });
    a.setAttribute("title", "Coming soon");
  });
})();
