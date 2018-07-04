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
  generateOptions();
  addListeners();
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
  <div id="octofilter-options" style="display: grid; grid-template-columns: 1fr 1fr 1fr;"></div>
  <button id="octofilter-btn" class="btn btn-primary btn-sm col-12 mt-3" type="submit">Apply</button>
  </div>`;

  const octofilterSettings = document.createElement("details");
  octofilterSettings.classList.add(
    "diffbar-item",
    "details-reset",
    "details-overlay",
    "position-relative",
    "text-center",
    "octofilter-details"
  );
  octofilterSettings.appendChild(summary);
  octofilterSettings.appendChild(popover);

  reviewTools.insertBefore(octofilterSettings, diffSettings);
}

function generateOptions() {
  const extensions = getFileExtensions();
  console.log(extensions);
  const options = extensions
    .map(
      ext => `
        <label for="octofilter-${ext}" class="text-normal">
          <input type="checkbox" class="octofilter-ext" name="${ext}" value="${ext}" id="octofilter-${ext}">
          <span class="commit-ref css-truncate user-select-contain expandable ">
            <span class="css-truncate-target">${ext}</span>
          </span>
        </label>`
    )
    .join("");
  const container = document.querySelector("#octofilter-options");
  console.log(options);
  container.innerHTML = options;
}

function getFileExtensions() {
  const diffs = document.querySelectorAll(".file.js-file.js-details-container");

  return [
    ...new Set(
      Array.from(diffs).map(node => {
        const filepath = node.children[0].dataset.path;
        return filepath.split(".").pop();
      })
    )
  ].sort();
}

function addListeners() {
  const config = { childList: true };
  const callback = function(mutationsList) {
    for (const mutation of mutationsList) {
      if (mutation.type == "childList" && mutation.addedNodes.length > 0) {
        generateOptions();
      }
    }
  };
  const containers = document.querySelectorAll(
    ".js-diff-progressive-container"
  );
  containers.forEach(c => {
    const observer = new MutationObserver(callback);
    observer.observe(c, config);
  });

  const button = document.querySelector("#octofilter-btn");
  button.addEventListener("click", handleApply);
}

function handleApply() {
  const checkboxes = document.querySelectorAll(".octofilter-ext");
  checkboxes.forEach(checkbox => {
    const ext = checkbox.value;
    if (checkbox.checked) {
      document
        .querySelectorAll(".file.js-file.js-details-container")
        .forEach(node => {
          if (node.children[0].dataset.path.split(".").pop() === ext) {
            node.classList.add("open", "Details--on");
          }
        });
    } else {
      document
        .querySelectorAll(".file.js-file.js-details-container")
        .forEach(node => {
          if (node.children[0].dataset.path.split(".").pop() === ext) {
            node.classList.remove("open", "Details--on");
          }
        });
    }
  });

  document.querySelector(".octofilter-details").open = false;
}
