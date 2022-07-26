// Met museum API. Makes a url based on search input and recieves data. Look in console.
var getSearchProps = function () {
  const input = document.getElementById("search_museum");
  const q = input.value;
  var artUrl =
    "https://collectionapi.metmuseum.org/public/collection/v1/search?q=" +
    encodeURIComponent(q);
  console.log(artUrl);
  fetch(artUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        console.log("data", data);
      });
    } else {
      alert("Error: " + response.statusText);
    }
  });
};

$("#search-items").on("click", function (event) {
  event.preventDefault();
  console.log("test");
  getSearchProps();
});
