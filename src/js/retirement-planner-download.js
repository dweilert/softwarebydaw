(function () {
    "use strict";

    // WHERE THE DOWNLOAD LINKS COME FROM.
    //
    // This used to call the GitHub API and read the latest release's assets.
    // That worked, but it meant the page's buttons pointed at github.com and
    // the page depended on an unauthenticated API with a shared rate limit —
    // a visitor behind a busy network could get a 403 and the fallback text.
    //
    // The release workflow in the retirement-planner repository now publishes
    // a manifest with the version AND a direct URL per platform, so this reads
    // one small file from our own site. Same-origin, no rate limit, and a
    // release can rename or add an installer without this file changing.
    //
    // The path is served by an Amplify REWRITE that proxies it to the S3
    // bucket the release uploads to. It is deliberately NOT a file in this
    // repository: a copy committed here would be hand-maintained, would go
    // stale the first time somebody forgot, and the app reads this same URL to
    // decide whether to tell a user an update exists.
    var MANIFEST_URL = "/retirement-planner/version.json";

    // Where to send someone if the manifest cannot be read at all. The GitHub
    // releases page always exists and always has every installer on it, so a
    // failure here degrades to "you get the files from the other place"
    // rather than to a dead button.
    var RELEASES_URL = "https://github.com/dweilert/retirement-planner/releases/latest";

    function setLink(id, url) {
        var el = document.getElementById(id);
        if (!el) return;
        el.href = url || RELEASES_URL;
    }

    // Unlike setLink, this leaves the element alone when there is no URL —
    // the HTML fallback for these two is an in-page anchor, and replacing it
    // with the GitHub release page would send a reader somewhere the site no
    // longer points.
    function setLinkOrKeep(id, url) {
        if (!url) return;
        var el = document.getElementById(id);
        if (el) {
            el.href = url;
            el.setAttribute("target", "_blank");
            el.setAttribute("rel", "noreferrer");
        }
    }

    function setStatus(text) {
        var el = document.getElementById("rp-download-status");
        if (el) el.textContent = text;
    }

    function fileNameFrom(url) {
        if (!url) return "";
        var parts = url.split("/");
        return parts[parts.length - 1] || "";
    }

    fetch(MANIFEST_URL, { cache: "no-cache" })
        .then(function (res) {
            if (!res.ok) throw new Error("manifest returned " + res.status);
            return res.json();
        })
        .then(function (data) {
            var version = (data.version || "").replace(/^v/, "");
            var downloads = data.downloads || {};

            setLink("rp-dl-mac", downloads.macos);
            setLink("rp-dl-win", downloads.windows);
            setLink("rp-dl-linux", downloads.linux);

            // The validation report link. The SBOM had a button here too until
            // 2026-08-14; it was removed from the page because a CycloneDX
            // JSON file is not something a visitor reads, and the manifest
            // still carries the URL for anyone who wants it.
            var reports = data.reports || {};
            setLinkOrKeep("rp-validation-report", reports.validation);

            // The Linux instructions quote a chmod against the real filename,
            // which is only right if we know what the file is actually called.
            var linuxCmdEl = document.getElementById("linux-cmd");
            var linuxName = fileNameFrom(downloads.linux);
            if (linuxCmdEl && /\.AppImage$/i.test(linuxName)) {
                linuxCmdEl.textContent = "chmod +x ./" + linuxName;
            }

            setStatus(version
                ? "Latest version: " + version
                : "Browse the latest release below.");
        })
        .catch(function () {
            // Every button already points at the GitHub release page in the
            // HTML, so leaving them untouched is the correct failure: the
            // visitor can still download, they just do not get the direct link.
            setStatus("Couldn't load the latest version automatically — the links below go to the release page.");
        });
})();
