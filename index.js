"use strict";

const reviewTools = document.querySelector(".pr-review-tools");
const diffSettings = reviewTools.children[0];

const carret = document.createElement("div");
carret.classList.add("dropdown-caret", "v-align-text-bottom");

const summary = document.createElement("summary");
summary.classList.add("btn", "btn-sm");
summary.textContent = "Octofilter settings";
summary.appendChild(carret);

const octofilterSettings = document.createElement("details");
octofilterSettings.classList.add(
  "diffbar-item",
  "details-reset",
  "details-overlay",
  "position-relative",
  "text-center"
);
octofilterSettings.appendChild(summary);

reviewTools.insertBefore(octofilterSettings, diffSettings);
