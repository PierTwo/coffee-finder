var slider = $(".carousel");
$(document).ready(function () {
  slider.carousel();
});

// Met museum API. Makes a url based on search input and recieves data. Look in console.
const input = $("#search_museum");

var getMuseumOne = function (q) {
  let selectedValue = "1";
  var objectUrl =
    "https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=" +
    encodeURIComponent(q);
  //console.log(artUrl);
  fetch(objectUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          // console.log("data", data);
          const objectIds = data.objectIDs || [];
          if (objectIds.length) {
            for (var i = 0; i < objectIds.length; i++) {
              var artUrl =
                "https://collectionapi.metmuseum.org/public/collection/v1/objects/" +
                objectIds[i];
              fetch(artUrl)
                .then(function (response) {
                  if (response.ok) {
                    response.json().then(function (data) {
                      if (data.primaryImage !== "") {
                        // var slider = $(".carousel");
                        // slider.carousel();
                        // console.log("image ", data.primaryImage);
                        const slide =
                          '<a class="image carousel-item active" href="#three!"><img src=' +
                          data.primaryImage +
                          "></a>";
                        // console.log("slide: ", slide);
                        slider.append(slide);

                        if (slider.hasClass("initialized")) {
                          slider.removeClass("initialized");
                        }

                        slider.carousel();
                      }
                    });
                  } else {
                    // alert("Error: " + response.statusText);
                    console.error("Not OK");
                  }
                })
                .catch(function (error) {
                  console.log("Inner Fetch 404 Not Found : " + error);
                });
            }
          }
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      console.log("Outer fetch 404 Not Found : " + error);
    });
};

function chicagoArt(q) {
  fetch(
    `https://api.artic.edu/api/v1/artworks/search?q=${q}&limit=5&fields=id,title,image_id,artist_title,thumbnail,date_display,place_of_origin,date_qualifier_title`
  )
    .then(function (response) {
      console.log(response);
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      chicagoArtResults(data.data);
    });

  function chicagoArtResults(results) {
    console.log(results.length);
    for (let i = 0; i < results.length; i++) {
      /*
      var img = $(`#c${i}`).attr(
        "src",
        `https://www.artic.edu/iiif/2/${results[i].image_id}/full/843,/0/default.jpg`
      );
      */
      if (results[i].image_id !== "") {
        // var slider = $(".carousel");
        // slider.carousel();
        // console.log("image ", data.primaryImage);
        const slide =
          '<a class="image carousel-item active" href="#three!"><img src=https://www.artic.edu/iiif/2/' +
          results[i].image_id +
          "/full/843,/0/default.jpg /></a>";
        // console.log("slide: ", slide);
        slider.append(slide);

        if (slider.hasClass("initialized")) {
          slider.removeClass("initialized");
        }

        slider.carousel();
      }
      // console.log(img);
      // carouselArray = ["#one!", "#two!", "#three!", "#four!", "#five!"]
      // var imgHTML = `<a class="carousel-item" href="${carouselArray[i]}"><img src=""></a>`
      // console.log(imgHTML);
      // $(".carousel").append(imgHTML);
    }
  }
}

$("select").on("change", function handleChange(event) {
  event.preventDefault();

  $("#search-items").removeAttr("disabled");

  let selectedValue = event.target.value;

  $("#search-items").on("click", function (event) {
    event.preventDefault();
    $(".carousel").empty();
    let q = input.val();

    if (selectedValue === "1") {
      // console.log("Met");
      getMuseumOne(q);
    } else if (selectedValue === "2") {
      console.log("Chicago");
      chicagoArt(q);
    }
  });
});
