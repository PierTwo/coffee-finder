// Retrieves elements from HTML
var slider = $(".carousel");
var nextBtn = $("#next");
var prevBtn = $("#prev");
var searchInput = $("#search_museum");
let saveTheImageSearch = JSON.parse(
  localStorage.getItem("savedImages") || "[]"
);

// Creates global variable to be used when assigning which museum the user chose
var selectedValue;

// Met museum API. Makes a url based on search input and recieves data.
// Makes two fetches beacuse the first fetch returns an array of object ids. The second fetch returns the artwork data. Takes the image and puts it in the carousel.
var metMuseum = function () {
  console.log("Met", searchInput.val());
  var objectUrl = `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${searchInput.val()}`;
  fetch(objectUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      returnObjects(data.objectIDs);
    })
    .catch(function() {
      alert("invalid input, please try again");
    });

  function returnObjects(objectIDs) {
    for (let i = 0; i < 20; i++) {
      fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectIDs[i]}`
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          console.log(data);
          if (data.primaryImage) {
            var carouselItem = `<div class="carousel-item" href="#${i}!"><h4>${data.title}</h4>`;

            if (data.artistDisplayName) {
              carouselItem += `<h5>${data.artistDisplayName}</h5>`;
            }
            if (data.objectDate) {
              carouselItem += `<h5>Date: ${data.objectDate}</h4>`;
            }

            carouselItem += `<img class="carouselImg" src="${data.primaryImage}">
              <br>
              <button id="prevBtn" class="btn waves-effect waves-light">Prev</button>
              <button id="linkBtn" class="btn waves-effect waves-light"><a href="${data.objectURL}" target="_blank">View on metmuseum.org</a></button>
              <button id="nextBtn" class="btn waves-effect waves-light">Next</button>
              </div>`;

            slider.append(carouselItem);
            slider.carousel({ fullWidth: true });
          }
        });
    }
    prevNext();
  }
};

// Function for the Chicago Art Institute. Return data of artwork and appends it to the carousel
function chicagoArt() {
  console.log("Chicago", searchInput.val());
  fetch(
    `https://api.artic.edu/api/v1/artworks/search?q=${searchInput.val()}&limit=20&fields=id,title,image_id,artist_title,thumbnail,date_display,place_of_origin`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data.data);
      chicagoArtResults(data.data);
    });

  function chicagoArtResults(results) {
    for (let i = 0; i < results.length; i++) {
      if (results[i].image_id) {
        var carouselItem = `<div class="carousel-item" href="#${i}!"><h4>${results[i].title}</h4>`;

        if (results[i].artist_title) {
          carouselItem += `<h5>${results[i].artist_title}</h5>`;
        }
        if (results[i].date_display) {
          carouselItem += `<h5>Date: ${results[i].date_display}</h5>`;
        }

        carouselItem += `<img class="carouselImg" src="https://www.artic.edu/iiif/2/${results[i].image_id}/full/843,/0/default.jpg">
          <br>
          <button id="prevBtn" class="btn waves-effect waves-light">Prev</button>
          <button id="linkBtn" class="btn waves-effect waves-light"><a href="https://www.artic.edu/artworks/${results[i].id}" target="_blank">View on artic.edu</a></button>
          <button id="nextBtn" class="btn waves-effect waves-light">Next</button>
          </div>`;

        slider.append(carouselItem);
      }
    }
    slider.carousel({ fullWidth: true });
    prevNext();
  }
}

// Reinitialize the carousel and removes artwork
function clearSlider() {
  if (slider.hasClass("initialized")) {
    slider.removeClass("initialized");
  }
  slider.empty();
}

// Change event handler for dropdown when selecting between museums
$("select").change(function (event) {
  event.preventDefault();

  // Prevents from calling API if search input is blank
  if (searchInput.val() !== ""){
  selectedValue = event.target.value;

  $("#search-items").removeAttr("disabled");
  }
});

// Click event handler for searching artwork
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
  }
 // Prevents from calling API if search input is blank
  if (searchInput.val() !== ""){
    saveImageSearch();
    savedArtSearches();
  } 
  
});

// Makes the prev and next buttons change carousel slide
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
}

// Function for setting local storage from user Input
function saveImageSearch() {
  let userInput = searchInput.val();
  saveTheImageSearch.push(userInput);
  localStorage.setItem("savedImages", JSON.stringify(saveTheImageSearch));
}

// Function that will display all search history buttons
function savedArtSearches() {
  $("#saved-art-searches").html("");

  // Loops through the save the image search local storage and then appends them to display on the page
  for (let i = 0; i < saveTheImageSearch.length; i++) {
    var saveSearchBtn = $("<button></button>").text(saveTheImageSearch[i]);
    saveSearchBtn.addClass("btn waves-effect waves-light s12 m6");
    $("#saved-art-searches").append(saveSearchBtn);
    saveSearchBtn.on("click", function (event) {
      event.preventDefault();
      clearSlider();
      console.log("ecent", event);

      // metMuseum();
      // chicagoArt();
      if (event.target.innerText !== "") {
        $('input[name="search-input"]').val(event.target.innerText);
        $("#museum-select").val("1");
        clearSlider();
        $("#search-items").removeAttr("disabled");
        metMuseum();
      }
    });
  }
}

// Calls saved art searches functions
savedArtSearches();
