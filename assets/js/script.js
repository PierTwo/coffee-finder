// Met museum API. Makes a url based on search input and recieves data. Look in console.
var getMuseumOne = function () {
  const input = document.getElementById("search_museum");
  const q = input.value;
  let selectedValue = "1";
  var objectUrl =
    "https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=" +
    encodeURIComponent(q);
  //console.log(artUrl);
  fetch(objectUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        console.log("data", data);
        const objectIds = data.objectIDs || [];
        if (objectIds.length) {
          const artObjects = [];
          for (var i = 0; i < objectIds.length; i++) {
            var artUrl =
              "https://collectionapi.metmuseum.org/public/collection/v1/objects/" +
              objectIds[i];
            fetch(artUrl).then(function (response) {
              if (response.ok) {
                response.json().then(function (data) {
                  //console.log("data", data);
                  if (data.primaryImage !== "") {
                    artObjects.push({
                      title: data.title,
                      primaryImage: data.primaryImage,
                      primaryImageSmall: data.primaryImageSmall,
                      additionalImages: data.additionalImages,
                      objectDate: data.objectDate,
                      artistDisplayName: data.artistDisplayName,
                    });
                    console.log(artObjects.primaryImage);
                  }
                  for (let i = 1; i < artObjects.length; i++) {
                    var artImages = artObjects[i].primaryImage;
                    // $("#art").attr("src", artImages);
                    // $("#art").show();
                    //init carousel
                    var slider = $(".carousel");
                    slider.carousel();

                    //add a new item
                    slider.append(
                      '<a class="carousel-item active" href="#three!"><img src="http://lorempixel.com/250/250/nature/3"></a>'
                    );

                    //remove the 'initialized' class which prevents slider from initializing itself again when it's not needed
                    if (slider.hasClass("initialized")) {
                      slider.removeClass("initialized");
                    }

                    //just reinit the carousel
                    slider.carousel();
                  }
                });
              } else {
                alert("Error: " + response.statusText);
              }
            });
          }
          console.log(artObjects);
          return artObjects;
        }
      });
    } else {
      alert("Error: " + response.statusText);
    }
  });
};

$("#search-items").on("click", function (event) {
  event.preventDefault();
  console.log("test");
  if (selectedValue === "1") {
    getMuseumOne();
  }
});

$("select").on("change", function handleChange(event) {
  event.preventDefault();
  $("#search-items").removeAttr("disabled");
  console.log(event.target.value);
  selectedValue = event.target.value;
  //getMuseumOne();
});
