filter(0)
var error = []
function filter(range) {
    if (range == 0) {
        var videos_map = map
        if (Object.keys(videos_map).length > 1) {
            document.getElementById("no_videos").style.display = "none"
            document.getElementById("videos").style.display = "block"
        } else {
            document.getElementById("no_videos").style.display = "block"
            document.getElementById("videos").style.display = "none"
        }
        for (var video of Object.keys(videos_map)) {
            if (video == "status") continue
            add_video_into_list(video)
        }

    } else {
        var videos_map = map
        document.getElementById("list").innerHTML = null
        for (var video of Object.keys(videos_map)) {
            var upload_date = minusDays(videos_map[video].at)
            if (upload_date >= range[0] && upload_date < range[1]) {
                add_video_into_list(video)
            }
        }

    }

}

$("#apply").click(function () {
    var range = {
        "1": [0, 1],
        "2": [1, 2],
        "3": [2, 3],
        "4": [3, 7],
        "5": [7, 30],
        "6": [30, 90],
        "7": [90, 180],
        "8": [180, 365],
        "9": [365, 9999999]
    }

    var value = $("#filter").val()
    if (value != "all") {
        filter(range[value])
    } else {
        document.getElementById("list").innerHTML = null
        filter(0)
    }

})


$("#delete").click(function () {
    var con = confirm("are you sure you want to delete all ?")
    if (con) {
        var json = JSON.stringify({
            "status": true
        })
        chrome.storage.sync.set({
            red: json
        }, function () {
            document.getElementById("no_videos").style.display = "block"
            document.getElementById("videos").style.display = "none"
        })
    }
});

function minusDays(date) {
    var diffTime = Math.abs(new Date() - new Date(date))
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}
function add_video_into_list(video) {
    var url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${video}&format=json`
    $.getJSON(url, function (json_data) {
        var thum = json_data["thumbnail_url"]
        var code = `
                    <div class="col-md-4">
                    <div class="card mb-4 box-shadow">
                    <a target="_blank" href="https://www.youtube.com/watch?v=${video}">
                        <img class="card-img-top"
                            src="${thum}"
                            alt="Card image cap">
                        <div class="card-body">
                            <p class="card-text">${map[video].title}</p><br>
                            <a href="${map[video].channel_link}">
                            <p class="card-text"><b>${map[video].channel_name}</b></p></a>

                            </a>
                            <br>
                            <div class="d-flex justify-content-between align-items-center">
                            <small style="font-size:17px;" class="text-muted"><b>${map[video].views} & ${map[video].gi} GI</b> </small>
                            <small style="font-size:17px;color:red" class="text-muted">${minusDays(map[video].date)} days ago</small>
                            </div>
                        </div>
                    </div>
                </div>
        `
        document.getElementById("list").insertAdjacentHTML('beforeend', code)
    }).fail(function () {
        var thum = "https://www.publicdomainpictures.net/pictures/280000/velka/not-found-image-15383864787lu.jpg"
        var code = `
                    <div class="col-md-4">
                    <div class="card mb-4 box-shadow">
                    <a target="_blank" href="https://www.youtube.com/watch?v=${video}">
                        <img class="card-img-top"
                            src="${thum}"
                            alt="Card image cap">
                        <div class="card-body">
                            <p class="card-text">${map[video].title}</p><br>
                            <a href="${map[video].channel_link}">
                            <p class="card-text"><b>${map[video].channel_name}</b></p></a>

                            </a>
                            <br>
                            <div class="d-flex justify-content-between align-items-center">
                            <small style="font-size:17px;" class="text-muted"><b>${map[video].views} & ${map[video].gi} GI</b> </small>
                            <small style="font-size:17px;color:red" class="text-muted">${minusDays(map[video].date)} days ago</small>
                            </div>
                        </div>
                    </div>
                </div>
        `
        document.getElementById("list").insertAdjacentHTML('beforeend', code)
    })

}
