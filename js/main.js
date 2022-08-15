const elts = {
  text1: document.getElementById("text1"),
  text2: document.getElementById("text2"),
};

const texts = [
  "HELLO",
  "HOLA",
  "হ্যালো",
  "أهلا",
  "नमस्ते",
  "привет",
  "你好",
  "MERHABA",
];

const morphTime = 1;
const cooldownTime = 0.25;

let textIndex = texts.length - 1;
let time = new Date();
let morph = 0;
let cooldown = cooldownTime;

elts.text1.textContent = texts[textIndex % texts.length];
elts.text2.textContent = texts[(textIndex + 1) % texts.length];

function doMorph() {
  morph -= cooldown;
  cooldown = 0;

  let fraction = morph / morphTime;

  if (fraction > 1) {
    cooldown = cooldownTime;
    fraction = 1;
  }

  setMorph(fraction);
}

function setMorph(fraction) {
  elts.text2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
  elts.text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

  fraction = 1 - fraction;
  elts.text1.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
  elts.text1.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

  elts.text1.textContent = texts[textIndex % texts.length];
  elts.text2.textContent = texts[(textIndex + 1) % texts.length];
}

function doCooldown() {
  morph = 0;

  elts.text2.style.filter = "";
  elts.text2.style.opacity = "100%";

  elts.text1.style.filter = "";
  elts.text1.style.opacity = "0%";
}

function animate() {
  requestAnimationFrame(animate);

  let newTime = new Date();
  let shouldIncrementIndex = cooldown > 0;
  let dt = (newTime - time) / 1000;
  time = newTime;

  cooldown -= dt;

  if (cooldown <= 0) {
    if (shouldIncrementIndex) {
      textIndex++;
    }

    doMorph();
  } else {
    doCooldown();
  }
}

animate();

var nav = document.querySelector("nav");
window.addEventListener("scroll", function () {
  if (window.pageYOffset > 100) {
    nav.classList.add("bg-dark", "shadow");
  } else {
    nav.classList.remove("bg-dark", "shadow");
  }
});

// progress bar
function makesvg(percentage, inner_text = "") {
  var abs_percentage = Math.abs(percentage).toString();
  var percentage_str = percentage.toString();
  var classes = "";

  if (percentage < 0) {
    classes = "danger-stroke circle-chart__circle--negative";
  } else if (percentage > 0 && percentage <= 30) {
    classes = "warning-stroke";
  } else {
    classes = "success-stroke";
  }

  var svg =
    '<svg class="circle-chart" viewbox="0 0 33.83098862 33.83098862" xmlns="http://www.w3.org/2000/svg">' +
    '<circle class="circle-chart__background" cx="16.9" cy="16.9" r="15.9" />' +
    '<circle class="circle-chart__circle ' +
    classes +
    '"' +
    'stroke-dasharray="' +
    abs_percentage +
    ',100"    cx="16.9" cy="16.9" r="15.9" />' +
    '<g class="circle-chart__info">' +
    '   <text class="circle-chart__percent" x="17.9" y="15.5">' +
    percentage_str +
    "%</text>";

  if (inner_text) {
    svg +=
      '<text class="circle-chart__subline" x="16.91549431" y="22">' +
      inner_text +
      "</text>";
  }

  svg += " </g></svg>";

  return svg;
}

(function ($) {
  $.fn.circlechart = function () {
    this.each(function () {
      var percentage = $(this).data("percentage");
      var inner_text = $(this).text();
      $(this).html(makesvg(percentage, inner_text));
    });
    return this;
  };
})(jQuery);

$(function () {
  $(".circlechart").circlechart();
});
