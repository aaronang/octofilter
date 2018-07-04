"use strict";

let status = "unavailable";

chrome.runtime.onMessage.addListener(function(request) {
  if (status === "loading" && request.status === "complete") {
    main();
    status = "complete";
  }

  if (request.url) {
    status = request.url.endsWith("files") ? "loading" : "complete";
  }
});

if (window.location.pathname.endsWith("files")) {
  main();
}

function main() {
  createButton();
}

function createButton() {
  const reviewTools = document.querySelector(".pr-review-tools");
  const diffSettings = reviewTools.children[0];

  const carret = document.createElement("div");
  carret.classList.add("dropdown-caret", "v-align-text-bottom");

  const summary = document.createElement("summary");
  summary.classList.add("btn", "btn-sm");
  summary.textContent = "Octofilter settings";
  summary.appendChild(carret);

  const popover = document.createElement("div");
  popover.classList.add("Popover", "js-diff-settings", "mt-2", "pt-1");
  popover.style.left = "-46px";
  popover.innerHTML = `
  <div class="Popover-message text-left p-3 mx-auto Box box-shadow-large">
  <!-- '"\` -->
  <!-- </textarea></xmp> -->
  <input name="utf8" type="hidden" value="✓">
  <h4 class="mb-2">Collapse</h4>
  <div id="octofilter-options"></div>
  <button class="btn btn-primary btn-sm col-12 mt-3" type="submit">Apply</button>
  </div>`;

  const octofilterSettings = document.createElement("details");
  octofilterSettings.classList.add(
    "diffbar-item",
    "details-reset",
    "details-overlay",
    "position-relative",
    "text-center"
  );
  octofilterSettings.appendChild(summary);
  octofilterSettings.appendChild(popover);

  reviewTools.insertBefore(octofilterSettings, diffSettings);
}
