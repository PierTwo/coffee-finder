// Met museum API. Makes a url based on search input and recieves data. Look in console.
const input = document.getElementById("search_museum");
const q = input.value;

var getMuseumOne = function () {
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
                                    console.log("data", data);
                                    if (data.primaryImage !== "") {
                                        artObjects.push({
                                            title: data.title,
                                            primaryImage: data.primaryImage,
                                            primaryImageSmall: data.primaryImageSmall,
                                            additionalImages: data.additionalImages,
                                            objectDate: data.objectDate,
                                            artistDisplayName: data.artistDisplayName,
                                        });
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

function chicagoArt() {
    fetch("https://api.artic.edu/api/v1/artworks/search?q=dogs&limit=5&fields=id,title,image_id,artist_title,thumbnail")
        .then(function (response) {
            console.log(response);
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            $("#art").attr("src", `https://www.artic.edu/iiif/2/${data.data[2].image_id}/full/843,/0/default.jpg`);
        });

};


$("select").on("change", function handleChange(event) {
    event.preventDefault();

    $("#search-items").removeAttr("disabled");

    let selectedValue = event.target.value;

    $("#search-items").on("click", function (event) {
        event.preventDefault();
        if (selectedValue === "1") {
            console.log("Met")
            getMuseumOne();
        } else if (selectedValue === "2") {
            console.log("Chicago");
            chicagoArt();
        };
    });
});
