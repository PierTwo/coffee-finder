var slider = $(".carousel");
var nextBtn = $("#next");
var prevBtn = $("#prev");
const searchInput = $("#search_museum");
let saveTheImageSearch = JSON.parse(localStorage.getItem("savedImages") || "[]");
var selectedValue;
// Met museum API. Makes a url based on search input and recieves data.

var metMuseum = function () {
  var objectUrl = `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${searchInput.val()}`;
  fetch(objectUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      returnObjects(data.objectIDs);
      console.log(data);
    });

  function returnObjects(objectIDs) {
    for (let i = 0; i < 10; i++) {
      fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectIDs[i]}`
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          if (data.primaryImage !== "") {
            var carouselItem = `<a class="image carousel-item" href="${data.objectURL}" target="_blank"><img src="${data.primaryImage}"></a>`;
            slider.append(carouselItem);
            slider.carousel();
          };
        });
    };
  };
};

function chicagoArt() {
  fetch(
    `https://api.artic.edu/api/v1/artworks/search?q=${searchInput.val()}&limit=10&fields=id,title,image_id,artist_title,thumbnail,date_display,place_of_origin,date_qualifier_title`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // console.log(data);
      chicagoArtResults(data.data);
    });

  function chicagoArtResults(results) {
    for (let i = 0; i < results.length; i++) {
      if (results[i].image_id !== "") {
        var carouselItem = `<div class="carousel-item" href="#${i}!">
        <h4>${results[i].title}</h4>
        <h5>${results[i].artist_title}</h5>
        <img class="carouselImg" src="https://www.artic.edu/iiif/2/${results[i].image_id}/full/843,/0/default.jpg">
        <br>
        <button id="prevBtn" class="btn waves-effect waves-light">Prev</button>
        <button id="nextBtn" class="btn waves-effect waves-light">Next</button>
        </div>`;
        slider.append(carouselItem);
      };
    };
    slider.carousel({ fullWidth: true });
    prevNext();
  };
};

function clearSlider() {
  if (slider.hasClass("initialized")) {
    slider.removeClass("initialized");
  };
  slider.empty();
};

$("select").change(function (event) {
  event.preventDefault();

  selectedValue = event.target.value;

  $("#search-items").removeAttr("disabled");
});

$("#search-items").click(function (event) {
  event.preventDefault();
  clearSlider();

  switch (selectedValue) {
    case "1":
      metMuseum();
      break;
    case "2":
      chicagoArt();
      break;
  };
  saveImageSearch();
  savedArtSearches();
});

function prevNext() {
  $(document).on("click", "#nextBtn", function (event) {
    event.preventDefault();
    console.log("next");
    var instance = M.Carousel.getInstance(slider);
    instance.next();
  });

  $(document).on("click", "#prevBtn", function (event) {
    event.preventDefault();
    console.log("prev");
    var instance = M.Carousel.getInstance(slider);
    instance.prev();
  });
};

function saveImageSearch() {
  let userInput = searchInput.val();
  saveTheImageSearch.push(userInput);

  localStorage.setItem("savedImages", JSON.stringify(saveTheImageSearch));
};

function savedArtSearches() {
  $("#saved-art-searches").html("");

  for (let i = 0; i < saveTheImageSearch.length; i++) {
    var saveSearchBtn = $("<button></button>").text(saveTheImageSearch[i]);
    saveSearchBtn.addClass("btn waves-effect waves-light s12 m6");
    $("#saved-art-searches").append(saveSearchBtn);
    saveSearchBtn.on("click", function (event) {
      event.preventDefault();
      clearSlider();

      metMuseum(saveTheImageSearch[i]);
      chicagoArt(saveTheImageSearch[i]);
    });
  };
};

