var slider = $(".carousel");
const searchInput = $("#search_museum");

// Met museum API. Makes a url based on search input and recieves data. Look in console.

var getMuseumOne = function () {
  var objectUrl = `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${searchInput.val()}`
  fetch(objectUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      returnObjects(data.objectIDs);
    });

  function returnObjects(objectIDs) {
    for (let i = 0; i < 10; i++) {
      fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectIDs[i]}`)
        .then(function (response) {
          return response.json()
        })
        .then(function (data) {
          console.log(data)
          var carouselItem = `<a class="image carousel-item" href="#${i}!"><img src="${data.primaryImage}"></a>`;
          slider.append(carouselItem);
          if (slider.children().length === 10) {
            slider.carousel();
          };
        });
    };
  };
};


function chicagoArt() {
  fetch(`https://api.artic.edu/api/v1/artworks/search?q=${searchInput.val()}&limit=10&fields=id,title,image_id,artist_title,thumbnail,date_display,place_of_origin,date_qualifier_title`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      chicagoArtResults(data.data);
    });

  function chicagoArtResults(results) {
    for (let i = 0; i < results.length; i++) {
      if (results[i].image_id !== "") {
        var carouselItem = `<a class="image carousel-item" href="#${i}!"><img src="https://www.artic.edu/iiif/2/${results[i].image_id}/full/843,/0/default.jpg"></a>`;
        slider.append(carouselItem);
      };
    };
    slider.carousel();
  };
};

var selectedValue;

$("select").change(function handleChange(event) {
  event.preventDefault();

  selectedValue = event.target.value;

  $("#search-items").removeAttr("disabled");

});

$("#search-items").on("click", function (event) {
  event.preventDefault();
  if (slider.hasClass("initialized")) {
    slider.removeClass("initialized");
  };
  slider.empty();
  switch (selectedValue) {
    case "1":
      getMuseumOne();
      break;
    case "2":
      chicagoArt();
      break;
  };
});