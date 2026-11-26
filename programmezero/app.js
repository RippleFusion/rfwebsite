(function () {
  // Your Substack publication subdomain, e.g. "programmezero" for programmezero.substack.com.
  // Leave empty to show a "signups open soon" message until the publication exists.
  var SUBSTACK = "";
  var SUBSCRIBE_URL = SUBSTACK ? "https://" + SUBSTACK + ".substack.com/api/v1/free?nojs=true" : "";

  var issues = window.PZ_ISSUES || [];
  var cards = document.getElementById("cards");
  var chipsEl = document.getElementById("chips");
  var q = document.getElementById("q");
  var empty = document.getElementById("empty");
  var active = "All";

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function fmt(d) {
    return new Date(d + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }

  var topics = ["All"];
  issues.forEach(function (i) { i.topics.forEach(function (t) { if (topics.indexOf(t) < 0) topics.push(t); }); });
  chipsEl.innerHTML = topics.map(function (t) {
    return '<button type="button" class="chip" aria-pressed="' + (t === "All") + '" data-t="' + esc(t) + '">' + esc(t) + "</button>";
  }).join("");
  chipsEl.addEventListener("click", function (e) {
    var b = e.target.closest(".chip"); if (!b) return;
    active = b.getAttribute("data-t");
    [].forEach.call(chipsEl.children, function (c) { c.setAttribute("aria-pressed", c === b); });
    render();
  });
  q.addEventListener("input", render);

  function render() {
    var term = q.value.trim().toLowerCase();
    var list = issues.filter(function (i) {
      var okT = active === "All" || i.topics.indexOf(active) >= 0;
      var hay = (i.title + " " + i.summary + " " + i.topics.join(" ")).toLowerCase();
      return okT && (!term || hay.indexOf(term) >= 0);
    });
    cards.innerHTML = list.map(function (i) {
      return '<a class="card" href="' + esc(i.url) + '"><div class="card-art" aria-hidden="true">#' + i.n + "</div>" +
        '<div class="card-body"><div class="card-meta">' + fmt(i.date) + " &middot; " + esc(i.topics.join(", ")) + "</div>" +
        "<h3>" + esc(i.title) + "</h3><p>" + esc(i.summary) + "</p></div></a>";
    }).join("");
    empty.hidden = list.length > 0;
  }
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
      var body = new URLSearchParams({ email: email });
      fetch(SUBSCRIBE_URL, { method: "POST", body: body, mode: "no-cors" })
        .then(function () { note.className = "form-note ok"; note.textContent = "You're in. Check your inbox to confirm."; form.reset(); })
        .catch(function () { note.className = "form-note err"; note.textContent = "Something went wrong. Please try again."; });
    });
  });

  // Placeholder links that are not live yet
  [].forEach.call(document.querySelectorAll("a[data-todo]"), function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); });
    a.setAttribute("title", "Coming soon");
  });
})();
