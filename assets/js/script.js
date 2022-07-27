// Met museum API. Makes a url based on search input and recieves data. Look in console.
const input = $("#search_museum")

var getMuseumOne = function (q) {
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

function chicagoArt(q) {
    $("#artResults").siblings().remove();

    fetch(`https://api.artic.edu/api/v1/artworks/search?q=${q}&limit=5&fields=id,title,image_id,artist_title,thumbnail,date_display,place_of_origin,date_qualifier_title`)
        .then(function (response) {
            console.log(response);
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            chicagoArtResults(data.data);
        });

    function chicagoArtResults(results) {
        console.log(results.length)
        for (let i = 0; i < results.length; i++) {
            var imgHTML = `<img src="https://www.artic.edu/iiif/2/${results[i].image_id}/full/843,/0/default.jpg"/>`
            $("#artResults").after(imgHTML);
        };
    };
};


$("select").on("change", function handleChange(event) {
    event.preventDefault();

    $("#search-items").removeAttr("disabled");

    let selectedValue = event.target.value;

    $("#search-items").on("click", function (event) {
        event.preventDefault();
        let q = input.val();

        if (selectedValue === "1") {
            console.log("Met")
            getMuseumOne(q);
        } else if (selectedValue === "2") {
            console.log("Chicago");
            chicagoArt(q);
        };
    });
});
