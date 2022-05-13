var port = chrome.runtime.connect({ name: "nasim" });
var val = {}
var updated_item = 0
var starting_url = window.location.href
!function () {
    chrome.storage.sync.get(['val'], function (result) {
        val = result.val
        if (val.length != 0) {
            if (val['login']) {
                start()
            } else if (val['alert']) {
                alert("Goodness Index : You are not logged in ")
                port.postMessage({
                    from: "remove_alert",
                });
            }
        }
    })
    function start() {
        $("body").on('DOMSubtreeModified', "#contents > ytd-grid-renderer", function () {
            $("#items").ready(function () {
                newVideoDetector();
            });
        });
    }


    function newVideoDetector() {
        var current_loaded_videos = document.querySelectorAll("#items > ytd-grid-video-renderer")
        var current_loaded_video_length = current_loaded_videos.length
        if (updated_item < current_loaded_video_length) {
            updateItem(current_loaded_videos)
            updated_item = current_loaded_video_length
        }
    }

    function updateItem(videos) {
        for (let i = updated_item; i < videos.length; i++) {
            var section = videos[i].querySelector("#metadata-line")
            var views = videos[i].querySelector("#metadata-line > span:nth-child(1)")
            var at = videos[i].querySelector("#metadata-line > span:nth-child(2)")
            var href = videos[i].querySelector("#video-title").href
            if (href.includes("/shorts/")) continue
            var id = videoId(href)
            var viewsInNum = viewStringToInt(views.innerText)
            var result = viewsInNum / averageCalculator(i, videos)
            var color_ = color(viewsInNum, result)
            var channels_link = String(window.location.href).replace("/videos", "")
            if (color_ === "red" && window.location.href === starting_url) {
                var upload_at = upload_at_calculator(at.innerText)
                upload_at = minusDays(upload_at)
                var data = {
                    "gi": parseFloat(result.toFixed(4)),
                    "at": upload_at,
                    "views": views.innerText,
                    "title": videos[i].querySelector("#video-title").innerText,
                    "channel_link": channels_link,
                    "img": videos[i].querySelector("#thumbnail").src,
                    "channel_name": document.querySelector("#channel-name").innerText
                }
                port.postMessage({
                    from: "found_red_gi_video",
                    id: id,
                    data: data,
                });
            }
            var gi = '</br><center><h3 style="color:' + color_ + ';"><b>G.I = ' + parseFloat(result.toFixed(4)); + '</b></h3></center>';
            section.insertAdjacentHTML('beforeend', gi)
        }
    }
    function upload_at_calculator(str) {
        str = str.split(" ")
        var days = 0
        if (str[1] === "days" || str[1] === "day") {
            days = parseInt(str[0])
        }
        if (str[1] === "weeks" || str[1] === "week") {
            var days = parseInt(str[0]) * 7
        }
        if (str[1] === "months" || str[1] === "month") {
            var days = parseInt(str[0]) * 31
        }
        if (str[1] === "year" || str[1] === "years") {
            var days = parseInt(str[0]) * 365
        }
        return days
    }
    function minusDays(days) {
        const d = new Date()
        d.setDate(d.getDate() - days)
        return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
    }

    function color(m, g) {
        var arr_m = [val['m1'], val['m2'], val['m3'], val['m4']]
        var arr_g = [val['g1'], val['g2'], val['g3'], val['g4']]
        if (m > arr_m[0] && g > arr_g[0]) {
            return "red"
        } else if (m > arr_m[1] && g > arr_g[1]) {
            return "red"
        } else if (m > arr_m[2] && g > arr_g[2]) {
            return "red"
        } else if (m > arr_m[3] && g > arr_g[3]) {
            return "red"
        }
        return "blue"

    }

    function viewStringToInt(str) {
        str = str.replace(" views", "")
        if (str.includes("K")) {
            str = parseFloat(str.replace("K", "")) * 1000
        } else if (str.includes("M")) {
            str = parseFloat(str.replace("M", "")) * 1000000
        } else if (str.includes("B")) {
            str = parseFloat(str.replace("B", "")) * 1000000000
        }
        return parseFloat(str)
    }

    function averageCalculator(start, videos) {

        var count = 0
        var sum = 0

        for (let n = start + 1; n < (parseInt(start) + parseInt(val['range'])) + 1; n++) {
            if (n > videos.length - 1) {
                break;
            }

            count += 1
            var views = videos[n].querySelector("#metadata-line > span:nth-child(1)")
            sum += viewStringToInt(views.innerText)

        }
        for (let p = start - 1; p >= (parseInt(start) - parseInt(val['range'])); p--) {
            if (p < 0) {
                break;
            }
            count += 1
            var views = videos[p].querySelector("#metadata-line > span:nth-child(1)")
            sum += viewStringToInt(views.innerText)

        }
        return sum / count
    }

    function videoId(href) {
        var id = href.split("v=")[1].trim()
        if (id.includes("&t=")) {
            var nid = id.split("&t=")[0]
            return nid
        }
        return id
    }

}()
