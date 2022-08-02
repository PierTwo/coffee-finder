// Retrieves elements from HTML
var slider = $(".carousel");
var nextBtn = $("#next");
var prevBtn = $("#prev");
var searchInput = $("#search_museum");
var savedArtEl = $("#saved-art-searches");

// Creates global variable to be used when assigning which museum the user chose
var selectedMuseumVal;

$(document).ready(function () {
  if (localStorage.length) {
    savedArtEl.removeClass("hide");
  };

  for (let i = 0; i < localStorage.length; i++) {
    savedSearch = JSON.parse(localStorage.getItem(i));

    var saveSearchBtn = $(`<button class="btn waves-effect waves-light s12 m6 savedSearch" data-museum="${savedSearch[1]}">${savedSearch[0]}</button>`);
    savedArtEl.append(saveSearchBtn);
  };
});

// Met museum API. Makes a url based on search input and recieves data.
// Makes two fetches beacuse the first fetch returns an array of object ids. The second fetch returns the artwork data. Takes the image and puts it in the carousel.
var metMuseum = function (searchValue) {
  var objectUrl = `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${searchValue}`;
  fetch(objectUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data)
      returnObjects(data.objectIDs);
    });

  function returnObjects(objectIDs) {
    for (let i = 0; i < 15; i++) {
      fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectIDs[i]}`
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          if (data.primaryImage) {
            var carouselItem = `<div class="carousel-item" href="#${i}!"><h4>${data.title}</h4>`;

            if (data.artistDisplayName) {
              carouselItem += `<h5>${data.artistDisplayName}</h5>`;
            };
            if (data.objectDate) {
              carouselItem += `<h5>Date: ${data.objectDate}</h4>`;
            };

            carouselItem += `<img class="carouselImg" src="${data.primaryImage}">
              <br>
              <button id="prevBtn" class="btn waves-effect waves-light">Prev</button>
              <button id="linkBtn" class="btn waves-effect waves-light"><a href="${data.objectURL}" target="_blank">View on metmuseum.org</a></button>
              <button id="nextBtn" class="btn waves-effect waves-light">Next</button>
              </div>`;

            slider.append(carouselItem);
            slider.carousel({ fullWidth: true });
          };
        });
    };
    prevNext();
  };
};

// Function for the Chicago Art Institute. Return data of artwork and appends it to the carousel
function chicagoArt(searchValue) {
  fetch(
    `https://api.artic.edu/api/v1/artworks/search?q=${searchValue}&limit=15&fields=id,title,image_id,artist_title,thumbnail,date_display`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      chicagoArtResults(data.data);
    });

  function chicagoArtResults(results) {
    for (let i = 0; i < results.length; i++) {
      if (results[i].image_id) {
        var carouselItem = `<div class="carousel-item" href="#${i}!"><h4>${results[i].title}</h4>`;

        if (results[i].artist_title) {
          carouselItem += `<h5>${results[i].artist_title}</h5>`;
        };
        if (results[i].date_display) {
          carouselItem += `<h5>Date: ${results[i].date_display}</h5>`;
        };

        carouselItem += `<img class="carouselImg" src="https://www.artic.edu/iiif/2/${results[i].image_id}/full/843,/0/default.jpg">
              <br>
              <button id="prevBtn" class="btn waves-effect waves-light">Prev</button>
              <button id="linkBtn" class="btn waves-effect waves-light"><a href="https://www.artic.edu/artworks/${results[i].id}" target="_blank">View on artic.edu</a></button>
              <button id="nextBtn" class="btn waves-effect waves-light">Next</button>
              </div>`;

        slider.append(carouselItem);
      };
    };
    slider.carousel({ fullWidth: true });
    prevNext();
  };
};

// Reinitialize the carousel and removes artwork
function clearSlider() {
  if (slider.hasClass("initialized")) {
    slider.removeClass("initialized");
  };
  slider.empty();
};

// Change event handler for dropdown when selecting between museums
$("select").change(function (event) {
  event.preventDefault();

  selectedMuseumVal = event.target.value;

  $("#search-items").removeAttr("disabled");
});

// Click event handler for searching artwork
$("#search-items").click(function (event) {
  event.preventDefault();
  clearSlider();

  switch (selectedMuseumVal) {
    case "1":
      metMuseum(searchInput.val());
      break;
    case "2":
      chicagoArt(searchInput.val());
      break;
  };

  savedArtEl.removeClass("hide");
  saveArtSearches();
});

// Makes the prev and next buttons change carousel slide
function prevNext() {
  $(document).on("click", "#nextBtn", function (event) {
    event.preventDefault();

    var instance = M.Carousel.getInstance(slider);
    instance.next();
  });

  $(document).on("click", "#prevBtn", function (event) {
    event.preventDefault();

    var instance = M.Carousel.getInstance(slider);
    instance.prev();
  });
};

function saveArtSearches() {
  var searchName;
  var savedArtArr = [];

  if (selectedMuseumVal == 1) {
    searchName = `${searchInput.val()} (Metropolitan Museum of Art)`
  } else {
    searchName = `${searchInput.val()} (Art Institute of Chicago)`
  };

  var saveSearchBtn = $(`<button class="btn waves-effect waves-light s12 m6 savedSearch" data-museum="${selectedMuseumVal}">${searchName}</button>`);

  $(".savedSearch").each(function () {
    savedArtArr.push($(this).text());
  });

  if (!savedArtArr.includes(searchName)) {
    savedArtEl.append(saveSearchBtn);
  };

  for (let i = 0; i < $(".savedSearch").length; i++) {
    var userSearch = [$(".savedSearch").eq([i]).text(), $(".savedSearch").eq([i]).attr("data-museum")];
    localStorage.setItem([i], JSON.stringify(userSearch));
  };
};

$(document).on("click", ".savedSearch", function (event) {
  event.preventDefault();

  if ($(this).attr("data-museum") == "1") {
    var searchValue = $(this).text().replace(" Metropolitan Museum of Art", "").trim();
    console.log(searchValue);
    metMuseum(searchValue);
  } else {
    var searchValue = $(this).text().replace(" (Art Institute of Chicago)", "").trim();
    console.log(searchValue);
    chicagoArt(searchValue);
  };
});

$("#clearHistory").click(function (event) {
  event.preventDefault();

  localStorage.clear();
  savedArtEl.addClass("hide");
});
