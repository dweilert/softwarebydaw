/**
 * Agency evaluation request — posts the modal's form to the same API that
 * carries site feedback, on its own route.
 *
 * Written in the same plain-ES5 style as feedback.js rather than in modern
 * syntax: this file is loaded directly by the browser with no build step, and
 * matching the neighbouring file matters more here than brevity.
 */
(function () {
    "use strict";

    var API_URL = "https://ra5do16vel.execute-api.us-east-2.amazonaws.com/agency-request";

    var form = document.getElementById("agency-request-form");
    if (!form) return;

    var statusEl = document.getElementById("agency-status");
    var submitBtn = document.getElementById("agency-submit");
    var fields = document.getElementById("agency-fields");
    var done = document.getElementById("agency-done");

    function value(id) {
        var el = document.getElementById(id);
        return el ? el.value : "";
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        statusEl.textContent = "";
        statusEl.className = "small mb-0";
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";

        var payload = {
            firmName: value("agency-firm"),
            contactName: value("agency-contact"),
            contactEmail: value("agency-email"),
            phone: value("agency-phone"),
            firmWebsite: value("agency-website"),
            advisorCount: value("agency-advisors"),
            role: value("agency-role"),
            notes: value("agency-notes"),
            hp: value("agency-hp"),
            sourcePage: location.pathname,
        };

        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })
            .then(function (res) {
                return res.json().then(function (data) { return { ok: res.ok, data: data }; });
            })
            .then(function (result) {
                if (result.ok) {
                    // Swap the form out rather than clearing it: a form that
                    // empties itself looks like it failed, and this one is
                    // submitted once.
                    fields.classList.add("d-none");
                    done.classList.remove("d-none");
                    submitBtn.classList.add("d-none");
                } else {
                    statusEl.textContent = result.data.error || "Something went wrong. Please try again.";
                    statusEl.className = "small mb-0 text-danger";
                }
            })
            .catch(function () {
                statusEl.textContent =
                    "Something went wrong sending that. Please email daveweilert@gmail.com instead.";
                statusEl.className = "small mb-0 text-danger";
            })
            .finally(function () {
                if (!submitBtn.classList.contains("d-none")) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = "Send request";
                }
            });
    });
})();
