// Retrieves elements from HTML
var slider = $(".carousel");
var nextBtn = $("#next");
var prevBtn = $("#prev");
var searchInput = $("#search_museum");
var savedArtEl = $("#saved-art-searches");

// Global variable to grab modal ID element
var modal = document.getElementById("modal");

// Function to show modal on .catch function
function showModal() {
  modal.style.display = "block";
}

// Function to listen for click if close button is clicked
function closeModal() {
  var closeModal = document.getElementById("close-modal");
  closeModal.addEventListener("click", function () {
    modal.style.display = "none";
  });
}

// Creates global variable to be used when assigning which museum the user chose
var selectedMuseumVal;

// When the document loads retrieve every localStorage and append a button with it to the page
$(document).ready(function () {
  for (let i = 0; i < localStorage.length; i++) {
    savedSearch = JSON.parse(localStorage.getItem(i));

    var saveSearchBtn = $(`<button class="btn waves-effect waves-light s12 m6 savedSearch" data-museum="${savedSearch[1]}">${savedSearch[0]}</button>`);
    savedArtEl.append(saveSearchBtn);
  };
});

// Met museum API. Makes a url based on search input and recieves data.
// Makes two fetches beacuse the first fetch returns an array of object ids. The second fetch returns the artwork data. Takes the image and puts it in the carousel.
var metMuseum = function (searchValue) {
  // Fetches the API with the searchValue passed to the function as the q query parameter
  var objectUrl = `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${searchValue}`;
  fetch(objectUrl)
    .then(function (response) {
      // Returns the response in JSON format
      return response.json();
    })
    .then(function (data) {
      // Call returnObjects with the objectIDs from the API data
      returnObjects(data.objectIDs);
    })
    .catch(function () {
      // Calls Modal function
      showModal();
      closeModal();
    });

  // Displays the artworks on the page
  function returnObjects(objectIDs) {
    // For the first 15 results
    for (let i = 0; i < 15; i++) {
      // Fetch the artwork with the currently iterated object ID
      fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectIDs[i]}`
      )
        .then(function (response) {
          // Returns the response in JSON format
          return response.json();
        })
        .then(function (data) {
          // If the currently iterated data has a primaryImage...
          if (data.primaryImage) {
            // Create a variable with HTML and use the currently iterated result's title object for the h4 tag
            var carouselItem = `<div class="carousel-item" href="#${i}!"><h4>${data.title}</h4>`;

            // If the data has an artistDisplayName add it to the carouselItem
            if (data.artistDisplayName) {
              carouselItem += `<h5>${data.artistDisplayName}</h5>`;
            };
            // If the data has and objectDate add it the carouselItem
            if (data.objectDate) {
              carouselItem += `<h5>Date: ${data.objectDate}</h4>`;
            };

            // Add the rest of the HTML to the carouselItem with the primaryImage and objectURL from the data
            carouselItem += `<img class="carouselImg" src="${data.primaryImage}">
              <br>
              <button id="prevBtn" class="btn waves-effect waves-light">Prev</button>
              <button id="linkBtn" class="btn waves-effect waves-light"><a href="${data.objectURL}" target="_blank">View on metmuseum.org</a></button>
              <button id="nextBtn" class="btn waves-effect waves-light">Next</button>
              </div>`;

            // Append the carouselItem to the carousel
            slider.append(carouselItem);
            // Initialize the carousel with fullWidth set to true
            slider.carousel({ fullWidth: true });
          };
        });
    };
    // Call the prevNext function
    prevNext();
  };
};

// Function for the Chicago Art Institute. Return data of artwork and appends it to the carousel
function chicagoArt(searchValue) {
  // Fetches the API with the searchValue passed to the function as the q query parameter
  fetch(
    `https://api.artic.edu/api/v1/artworks/search?q=${searchValue}&limit=15&fields=id,title,image_id,artist_title,thumbnail,date_display&is_public_domain=true`
  )
    .then(function (response) {
      // Returns the response in JSON format
      return response.json();
    })
    .then(function (data) {
      // Passes the data object from the data retrieved from the API to chicagoArtResults
      chicagoArtResults(data.data);
    })
    .catch(function () {
      // Calls Modal function
      showModal();
      closeModal();
    });

  // Displays the results of the search
  function chicagoArtResults(results) {
    // For every result from the search...
    for (let i = 0; i < results.length; i++) {
      // If it has an image ID...
      if (results[i].image_id) {
        // Create a variable with HTML and use the currently iterated result's title object for the h4 tag
        var carouselItem = `<div class="carousel-item" href="#${i}!"><h4>${results[i].title}</h4>`;

        // If the result has a artist_title object
        if (results[i].artist_title) {
          // Add the iterated result's artist_title object to the carouselItem variable
          carouselItem += `<h5>${results[i].artist_title}</h5>`;
        };
        //  If the result has a date_display object
        if (results[i].date_display) {
          // Add the iterated result's date_display object to the carouselItem variable
          carouselItem += `<h5>Date: ${results[i].date_display}</h5>`;
        };

        // Add the rest of the HTML to the carouselItem variable with the results image_id for the art and a url with the results id
        carouselItem += `<img class="carouselImg" src="https://www.artic.edu/iiif/2/${results[i].image_id}/full/843,/0/default.jpg">
              <br>
              <button id="prevBtn" class="btn waves-effect waves-light">Prev</button>
              <button id="linkBtn" class="btn waves-effect waves-light"><a href="https://www.artic.edu/artworks/${results[i].id}" target="_blank">View on artic.edu</a></button>
              <button id="nextBtn" class="btn waves-effect waves-light">Next</button>
              </div>`;

        // append the carouselItem to the carousel
        slider.append(carouselItem);
      };
    };
    // Initialize the carousel with fullWidth set to true
    slider.carousel({ fullWidth: true });
    // Calls the prevNext function
    prevNext();
  };
};

// Reinitialize the carousel and removes artwork
function clearSlider() {
  // If the carousel is initialized remove the intialized class
  if (slider.hasClass("initialized")) {
    slider.removeClass("initialized");
  };
  // Removes all children from the carousel
  slider.empty();
};

// Change event handler for dropdown when selecting between museums
$("select").change(function (event) {
  // Prevents the default event when dropdown is changed
  event.preventDefault();
  // Sets the variable to the value of the target dropdown
  selectedMuseumVal = event.target.value;
  // Enables the search button
  $("#search-items").removeAttr("disabled");
});

// Click event handler for search button
$("#search-items").click(function (event) {
  // Prevents defualt event when clicked
  event.preventDefault();
  // Calls clearSlider
  clearSlider();

  // Prevents from calling API functions and savedArtSearches function if search input is blank
  if (searchInput.val() !== "") {
    selectedValue = event.target.value;
    // switch statement to call the museum functions depending on the selected museum the user chose
    switch (selectedMuseumVal) {
      case "1":
        // Call metMuseum and pass it the search input value
        metMuseum(searchInput.val());
        break;
      case "2":
        // Call chicagoArt and pass it the search input value
        chicagoArt(searchInput.val());
        break;
    };
    // Calls savedArtSearches
    saveArtSearches();
  };
});

// Makes the prev and next buttons change carousel slide
function prevNext() {
  // Adds event handler to the next button
  $(document).on("click", "#nextBtn", function (event) {
    // Prevents default event when clicked
    event.preventDefault();

    // Creates a variable with a instance of the carousel
    var instance = M.Carousel.getInstance(slider);
    // Moves the the next slide
    instance.next();
  });

  // Adds event handler to the prev button
  $(document).on("click", "#prevBtn", function (event) {
    // Prevents default event when clicked
    event.preventDefault();

    // Creates a variable with a instance of the carousel
    var instance = M.Carousel.getInstance(slider);
    // Moves the the previous slide
    instance.prev();
  });
};

// Saves the art seaches and creates a button to display it
function saveArtSearches() {
  // Creates a variable for searchName to be given value later
  var searchName;
  // Creates a variable with an empty array
  var savedArtArr = [];

  // If statement to set searchName to the search that was inputted and the museum name depending on the museum chosen
  if (selectedMuseumVal == 1) {
    searchName = `${searchInput.val()} (Metropolitan Museum of Art)`
  } else if (selectedMuseumVal == 2) {
    searchName = `${searchInput.val()} (Art Institute of Chicago)`
  };
  // Creates a variable of HTML with a data attribute of the selected museum's value and the text content to searchName
  var saveSearchBtn = $(`<button class="btn waves-effect waves-light s12 m6 savedSearch" data-museum="${selectedMuseumVal}">${searchName}</button>`);

  // Pushes this search to the array of savedArtArr
  $(".savedSearch").each(function () {
    savedArtArr.push($(this).text());
  });

  // If the array does NOT include the searchName variable then append saveSearchBtn to savedArtEl
  if (!savedArtArr.includes(searchName)) {
    savedArtEl.append(saveSearchBtn);
  };

  // For loop to set the saved search to local storage and stringify it
  for (let i = 0; i < $(".savedSearch").length; i++) {
    var userSearch = [$(".savedSearch").eq([i]).text(), $(".savedSearch").eq([i]).attr("data-museum")];
    localStorage.setItem([i], JSON.stringify(userSearch));
  };
};

// Adds click event handler to the saved art searches buttons to search for that saved search
$(document).on("click", ".savedSearch", function (event) {
  // Prevents default event when clicked
  event.preventDefault();
  // Calls the clearSlider function
  clearSlider();

  // If the data attribute of the button clicked is equal to 1...
  if ($(this).attr("data-museum") == "1") {
    // Creates a variable with the text of the button with the museuem name removed
    var searchValue = $(this).text().replace(" (Metropolitan Museum of Art)", "").trim();
    // Calls the metMuseum function and passes the variable to it
    metMuseum(searchValue);
    // Otherwise if the data attribute of the button clicked is 2...
  } else if ($(this).attr("data-museum") == "2") {
    // Create the searchValue variable with the text of the button with the museum name removed
    var searchValue = $(this).text().replace(" (Art Institute of Chicago)", "").trim();
    // Calls the chicagoArt function andd pess the variable to it
    chicagoArt(searchValue);
  };
});

// Adds click event handler to the Clear Search History Button to remove the search history
$("#clearHistory").click(function (event) {
  // Prevents default event when clicked
  event.preventDefault();

  // Clears local storage
  localStorage.clear();
  // Removes all the children of savedArtEl
  savedArtEl.empty();
});
