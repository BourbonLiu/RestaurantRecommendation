const center = { lat: 45.5042, lng: -122.6816 };
let map, pos_infoWindow;
let allPosMarkers = [];
let allPosMarkers2 = [];
let allResMarkers = [];

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        mapId: "9e0e90f4190ec34f",
        center: center,
        scaleControl: true,
        zoom: 13,
        mapTypeControl: false
    });

    // create a button on the map to get current location
    const locationButton = document.createElement("button");
    locationButton.textContent = "Get Your Current Location";
    locationButton.classList.add("custom-map-control-button");
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);

    // this inforwindow is for showing message when your current position found
    pos_infoWindow = new google.maps.InfoWindow();
    locationButton.addEventListener("click", () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };

                    pos_infoWindow.setPosition(pos);
                    pos_infoWindow.setContent("You are here !");
                    pos_infoWindow.open(map);             // set infowindow open on which map
                    map.setCenter(pos);
                },
                () => {
                    handleLocationError(true, pos_infoWindow, map.getCenter());
                }
            );
        } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, pos_infoWindow, map.getCenter());
        }
    });

    map.addListener("click", (MouseEvent) => {
        // when you click on the map,mark the location on the map 
        clearResMarkers();
        clearPosMarker();
        clearPosMarker2();
        addPosMarker(MouseEvent.latLng);
        addPosMarker2(MouseEvent.latLng)

        // send the geoLocation to server
        var loc = JSON.stringify(MouseEvent.latLng.toJSON());
        submitForm(loc);

    });

}

// deal with exception when locate current position
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
        browserHasGeolocation
            ? "Error: The Geolocation service failed."
            : "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
}


// submit form via AJAX
function submitForm(string) {
    document.getElementById('location').value = string;
    var value = $('input[name=location]').val();

    $('#geolocation').ajaxSubmit({
        dataType: 'json',                  // 'xml', 'script', or 'json' (expected server response type) 
        url: 'http://10.120.30.53:8082/livy',        // override for form's 'action' attribute
        type: 'post',                       // 'get' or 'post', override for form's 'method' attribute
        success: function (data) {
            console.log('Submit Successfully:\n' + $('form').serialize());
            console.log(data);

            dataToMark = JSON.parse(data[0]).business_id_listInRange;
            console.log(dataToMark.length);

            recomList = JSON.parse(data[1]).recommender_list;
            console.log(recomList.length);

            predictscore = JSON.parse(data[1]).predictscore;
            console.log(predictscore.length);

            markOnMap(dataToMark, recomList, predictscore);
        },
        error: function () {
            console.log('Submit Failed:\n' + $('form').serialize());
        },
    });
    return false;                         // return false to prevent normal browser submit and page navigation
}

// mark each restaurant's position on the map
function markOnMap(response, list, score) {
    for (var i = 0; i < response.length; i++) {
        var path; var color; var scale; var predict;

        if(list.includes(response[i].business_id)){
            path = google.maps.SymbolPath.BACKWARD_CLOSED_ARROW;
            predict = score[list.indexOf(response[i].business_id)];
            scale = 4;
            if(response[i].stars<="1.0"){
                color = "#FFE153";
            }else if(response[i].stars<="2.0"){
                color = "#FF9D6F";
            }else if( response[i].stars<="3.0"){
                color = "#B766AD";
            }else if(response[i].stars<="4.0"){
                color = "#921AFF";
            }else{
                color = "#0000E3";
            };
        }else{
            path = google.maps.SymbolPath.CIRCLE;
            color = "#ADADAD";
            scale = 6;
            predict = 0;
        };

        var latLng = new google.maps.LatLng(response[i].latitude, response[i].longitude);
        const resMarker = new google.maps.Marker({
            position: latLng,        // 圖點位置
            map: map,
            icon: {
                path: path,   // 使用圖圈圖形
                strokeColor: color, // 線條顏色
                strokeWeight: 1,     // 線條粗細
                fillColor: color,   // 填充顏色
                fillOpacity: 0.5,    // 填充透明度
                scale: scale,            // 圖形大小
            }

        });

        allResMarkers.push(resMarker);

        const name = response[i].name;
        var star = response[i].stars;
        var address = (response[i].address == "null") ? "Not Available" : response[i].address;
        var time = (response[i].hours == "null") ? "Not Available" : response[i].hours.slice(1, -1).replaceAll(",", "<br/>").replaceAll("'", "");
        const captionArray = response[i].caption.replace("WrappedArray(", "").replace(")", "").split(", ");
        const photoArray = response[i].photo_id.replace("WrappedArray(", "").replace(")", "").split(", ");
        var photo_id = (response[i].photo_id == "null") ? "000" : photoArray[0];

        // &#9733;是★的Unicode
        const content =
            `<div style='float:left;'>
            <img src='../photos/${photo_id}.jpg' width="250" height="250">
        </div>
        <div style='float:right; padding: 10px; font-size:14px;'>
            <span style='font-size:18px; font-weight:bold;'>${name}</span><br/>
            <div style="position: relative; vertical-align: middle; display: inline-block; font-size: 20px; text-shadow: 0px 1px 0 #999; color: #ddd; overflow: hidden;">
            <div>&#9733;&#9733;&#9733;&#9733;&#9733;</div>
            <div style="width: ${star * 20}%; position: absolute; left: 0; top: 0; white-space: nowrap; overflow: hidden; color: #FFD306;">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
            </div><br/>
            <div style="position: relative; vertical-align: middle; display: inline-block; font-size: 20px; text-shadow: 0px 1px 0 #999; color: #ddd; overflow: hidden;">
            <div>&#9733;&#9733;&#9733;&#9733;&#9733;</div>
            <div style="width: ${predict * 20}%; position: absolute; left: 0; top: 0; white-space: nowrap; overflow: hidden; color: #009100;">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
            </div><br/>
            <img src='../image/111.jpg' width="15" height="15">
            <span>${address}</span><br/>
            <hr>
            <span>${time}</span>
        </div>`;

        const marker_infowindow = new google.maps.InfoWindow({ Content: content });

        resMarker.addListener("mouseover", () => {
            marker_infowindow.open(map, resMarker);
        });
        resMarker.addListener("mouseout", () => {
            marker_infowindow.close();
        });
        resMarker.addListener("click", () => {
            photos = document.getElementById("photos");
            photos.innerHTML = "";
            title = document.getElementById("title");
            title.innerText = name;
            var k = (photoArray.length<10) ? photoArray.length : 10;
            for(var j = 0; j < k; j++){
                const photo = photoArray[j];
                const caption = captionArray[j];

                figure = document.createElement("figure");
                figure.setAttribute("id", "figure");
                figure.setAttribute("class", "list-group");

                img = document.createElement("img");
                img.setAttribute("src", `/photos/${photo}.jpg`);

                figcaption = document.createElement("figcaption");
                figcaption.innerText = caption;

                hr = document.createElement("hr");

                figure.append(img); figure.append(figcaption); figure.append(hr);
                photos.append(figure);
            }
        });
    }
}

// add location maker on the map
function addPosMarker(position) {
    const posMarker = new google.maps.Circle({
        strokeColor: "#FF8000",
        strokeOpacity: 1,
        strokeWeight: 2,
        fillColor: "#FF8000",
        fillOpacity: 0.1,
        map,
        center: position,
        radius: 550,
    });
    allPosMarkers.push(posMarker)
}

function addPosMarker2(position) {
    const posMarker2 = new google.maps.Marker({
        map: map,
        position: position,
    });
    allPosMarkers2.push(posMarker2)
}

// clear location maker on the map
function clearPosMarker() {
    for (let i = 0; i < allPosMarkers.length; i++) {
        allPosMarkers[i].setMap(null);
    }
    allPosMarkers = [];
}

function clearPosMarker2() {
    for (let i = 0; i < allPosMarkers2.length; i++) {
        allPosMarkers2[i].setMap(null);
    }
    allPosMarkers2 = [];
}

// clear all of restaurants makers on the map
function clearResMarkers() {
    for (let i = 0; i < allResMarkers.length; i++) {
        allResMarkers[i].setMap(null);
    }
    allResMarkers = [];
}

