(function () {
    "use strict";

    var REPO = "dweilert/retirement-planner";
    var RELEASES_URL = "https://github.com/" + REPO + "/releases/latest";

    function findAsset(assets, patterns) {
        for (var p = 0; p < patterns.length; p++) {
            for (var i = 0; i < assets.length; i++) {
                if (patterns[p].test(assets[i].name)) {
                    return assets[i];
                }
            }
        }
        return null;
    }

    function setLink(id, asset, fallbackUrl) {
        var el = document.getElementById(id);
        if (!el) return;
        el.href = asset ? asset.browser_download_url : fallbackUrl;
    }

    function setStatus(text) {
        var el = document.getElementById("rp-download-status");
        if (el) el.textContent = text;
    }

    fetch("https://api.github.com/repos/" + REPO + "/releases/latest")
        .then(function (res) {
            if (!res.ok) throw new Error("GitHub API returned " + res.status);
            return res.json();
        })
        .then(function (data) {
            var version = (data.tag_name || "").replace(/^v/, "");
            var assets = data.assets || [];

            var mac = findAsset(assets, [/\.dmg$/i]);
            var win = findAsset(assets, [/-setup\.exe$/i, /\.exe$/i, /\.msi$/i]);
            var linux = findAsset(assets, [/\.AppImage$/i, /\.deb$/i, /\.rpm$/i]);
            var linuxAppImage = findAsset(assets, [/\.AppImage$/i]);

            setLink("rp-dl-mac", mac, RELEASES_URL);
            setLink("rp-dl-win", win, RELEASES_URL);
            setLink("rp-dl-linux", linux, RELEASES_URL);

            var linuxCmdEl = document.getElementById("linux-cmd");
            if (linuxCmdEl && linuxAppImage) {
                linuxCmdEl.textContent = "chmod +x ./" + linuxAppImage.name;
            }

            setStatus(version
                ? "Latest version: " + version
                : "Browse the latest release below.");
        })
        .catch(function () {
            setStatus("Couldn't load the latest release automatically — the links below go straight to GitHub.");
        });
})();
