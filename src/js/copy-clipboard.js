(function () {
    "use strict";

    document.querySelectorAll(".copy-btn").forEach(function (btn) {
        btn.addEventListener("click", function () {
            var targetId = btn.getAttribute("data-copy-target");
            var target = document.getElementById(targetId);
            if (!target) return;

            var text = target.textContent.replace(/\s+/g, " ").trim();

            function showCopied() {
                var original = btn.innerHTML;
                btn.innerHTML = 'Copied!<i class="px-2 fas fa-check"></i>';
                btn.classList.add("copied");
                setTimeout(function () {
                    btn.innerHTML = original;
                    btn.classList.remove("copied");
                }, 2000);
            }

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(showCopied).catch(function () {
                    fallbackCopy(text);
                    showCopied();
                });
            } else {
                fallbackCopy(text);
                showCopied();
            }
        });
    });

    function fallbackCopy(text) {
        var el = document.createElement("textarea");
        el.value = text;
        el.style.position = "fixed";
        el.style.opacity = "0";
        document.body.appendChild(el);
        el.select();
        try { document.execCommand("copy"); } catch (e) { /* no-op */ }
        document.body.removeChild(el);
    }

    var setupToggle = document.getElementById("setup-toggle");
    var setupChevron = document.getElementById("setup-chevron");
    var setupPanel = document.getElementById("setup-panel");
    if (setupToggle && setupChevron && setupPanel) {
        setupPanel.addEventListener("shown.bs.collapse", function () {
            setupChevron.className = "px-2 bi bi-chevron-up";
        });
        setupPanel.addEventListener("hidden.bs.collapse", function () {
            setupChevron.className = "px-2 bi bi-chevron-down";
        });
    }
})();
