filter(0)
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
            add_video_into_list(video, videos_map[video].gi, videos_map[video].at, videos_map[video].views)
        }
    } else {
        document.getElementById("list").innerHTML = null

        var videos_map = JSON.parse(map)
        if (Object.keys(videos_map).length > 1) {
            document.getElementById("no_videos").style.display = "none"
            document.getElementById("videos").style.display = "block"
        } else {
            document.getElementById("no_videos").style.display = "block"
            document.getElementById("videos").style.display = "none"
        }
        for (var video of Object.keys(videos_map)) {
            if (video == "status") continue
            var upload_date = minusDays(videos_map[video].at)
            if (upload_date >= range[0] && upload_date < range[1]) {
                add_video_into_list(video, videos_map[video].gi, videos_map[video].at, videos_map[video].views)
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

function add_video_into_list(vid, gi, date, vies) {
    var url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${vid}&format=json`
    $.getJSON(url, function (json_data) {
        var code = `
                    <div class="col-md-4">
                    <div class="card mb-4 box-shadow">
                    <a target="_blank" href="https://www.youtube.com/watch?v=${vid}">
                        <img class="card-img-top"
                            src="${json_data["thumbnail_url"]}"
                            alt="Card image cap">
                        <div class="card-body">
                            <p class="card-text">${json_data["title"]}</p><br>
                            <a href="${json_data["author_url"]}">
                            <p class="card-text"><b>${json_data["author_name"]}</b></p></a>

                            </a>
                            <br>
                            <div class="d-flex justify-content-between align-items-center">
                            <small style="font-size:17px;" class="text-muted"><b>${vies} & ${gi} GI</b> </small>
                            <small style="font-size:17px;color:red" class="text-muted">${minusDays(date)} days ago</small>
                            </div>
                        </div>
                    </div>
                </div>
        `
        document.getElementById("list").insertAdjacentHTML('beforeend', code)
    });

}
