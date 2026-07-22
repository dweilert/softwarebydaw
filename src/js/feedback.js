(function () {
    "use strict";

    var API_URL = "https://ra5do16vel.execute-api.us-east-2.amazonaws.com/feedback";

    var form = document.getElementById("feedback-form");
    if (!form) return;

    var typeField = document.getElementById("feedback-type");
    var bugReportField = document.getElementById("bug-report-field");
    var descriptionLabel = document.getElementById("description-label");
    var description = document.getElementById("description");
    var tabBug = document.getElementById("tab-bug");
    var tabEnhancement = document.getElementById("tab-enhancement");
    var statusEl = document.getElementById("feedback-status");
    var submitBtn = document.getElementById("submit-btn");

    function setType(type) {
        typeField.value = type;
        if (type === "bug") {
            bugReportField.classList.remove("d-none");
            descriptionLabel.textContent = "What happened?";
            description.placeholder = "Describe what you were doing and what went wrong...";
            tabBug.classList.add("btn-primary");
            tabBug.classList.remove("btn-outline-primary");
            tabEnhancement.classList.add("btn-outline-primary");
            tabEnhancement.classList.remove("btn-primary");
        } else {
            bugReportField.classList.add("d-none");
            descriptionLabel.textContent = "What would you like to see?";
            description.placeholder = "Describe the feature or improvement you'd like...";
            tabEnhancement.classList.add("btn-primary");
            tabEnhancement.classList.remove("btn-outline-primary");
            tabBug.classList.add("btn-outline-primary");
            tabBug.classList.remove("btn-primary");
        }
        statusEl.textContent = "";
    }

    tabBug.addEventListener("click", function () { setType("bug"); });
    tabEnhancement.addEventListener("click", function () { setType("enhancement"); });

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        statusEl.textContent = "";
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";

        var payload = {
            type: typeField.value,
            description: description.value,
            appBugReport: document.getElementById("appBugReport").value,
            contactName: document.getElementById("contactName").value,
            contactEmail: document.getElementById("contactEmail").value,
            website: document.getElementById("website-hp").value,
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
                    form.reset();
                    setType(typeField.value);
                    statusEl.textContent = "Thanks — this has been sent.";
                    statusEl.className = "ms-3 text-success";
                } else {
                    statusEl.textContent = result.data.error || "Something went wrong. Please try again.";
                    statusEl.className = "ms-3 text-danger";
                }
            })
            .catch(function () {
                statusEl.textContent = "Something went wrong. Please try again.";
                statusEl.className = "ms-3 text-danger";
            })
            .finally(function () {
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Submit<i class="px-2 fas fa-paper-plane"></i>';
            });
    });
})();
