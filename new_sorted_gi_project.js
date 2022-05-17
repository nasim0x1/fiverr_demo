// https://img.youtube.com/vi/263xt_4mBNc/maxresdefault.jpg

init()
lans.forEach(function (element) {
    document.querySelector("#Langauge").add(new Option(element, element));
});

$('#Langauge').change(function () {
    if ("all" != $("#Langauge").val()) {
        new_filter("lan", $("#Langauge").val())
    } else {
        init()
    }
});

$('#sort').change(function () {
    var value = $("#sort").val()

    if (value != "all") {
        new_filter("sort", $(this).val())
    } else {
        init()
    }
});
$('#filter').change(function () {
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
        new_filter("filter", range[value])
    } else {
        document.getElementById("list").innerHTML = null
        init()
    }
});


function new_filter(section, val) {
    document.getElementById("list").innerHTML = null
    console.log(section + " => " + val)
    if (section === "lan") {

        apply_lang(val)
    }
    if (section === "filter") {
        apply_filter(val)
    }
    if (section === "sort") {
        apply_sort(val)
    }
}
function apply_lang(lan) {
    $('#filter')[0].selectedIndex = 0;
    $('#sort')[0].selectedIndex = 0;
    for (var video of Object.keys(map)) {
        if (map[video]['lan'] == lan) {
            add_video_into_list(video)

        }

    }
}
function apply_filter(range) {
    $('#Langauge')[0].selectedIndex = 0;
    $('#sort')[0].selectedIndex = 0;

    for (var video of Object.keys(map)) {
        var upload_date = minusDays(map[video].at)
        if (upload_date >= range[0] && upload_date < range[1]) {
            add_video_into_list(video)
        }
    }
}
function apply_sort(val) {
    $('#Langauge')[0].selectedIndex = 0;
    $('#filter')[0].selectedIndex = 0;


    switch (val) {
        case "a":
            var sorted = Object.keys(map).sort((a, b) => map[a].gi - map[b].gi).reverse()
            sorted.forEach((video) => {
                add_video_into_list(video)
            })
            break
        case "b":
            var sorted = Object.keys(map).sort((a, b) => map[a].at - map[b].at)
            sorted.forEach((video) => {
                add_video_into_list(video)
            })
            break
        case "c":
            var sorted = Object.keys(map).sort((a, b) => map[a].at - map[b].at).reverse()
            sorted.forEach((video) => {
                add_video_into_list(video)
            })
            break
        case "d":
            var sorted = Object.keys(map).sort((a, b) => map[a].v - map[b].v).reverse()
            sorted.forEach((video) => {
                add_video_into_list(video)
            })
            break
    }


}
function init() {
    if (Object.keys(map).length > 1) {
        document.getElementById("no_videos").style.display = "none"
        document.getElementById("videos").style.display = "block"
    } else {
        document.getElementById("no_videos").style.display = "block"
        document.getElementById("videos").style.display = "none"
    }
    for (var video of Object.keys(map)) {
        if (video == "status") continue
        add_video_into_list(video)
    }
}
function minusDays(date) {
   var pre = new Date();
    pre.setDate(pre.getDate() - date);
    var diffTime = Math.abs(new Date() - pre)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}
function add_video_into_list(video) {
    var thum = `https://img.youtube.com/vi/${video}/mqdefault.jpg`
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
                            <small style="font-size:17px;color:red" class="text-muted">${minusDays(map[video].at)} days ago</small>
                            </div>
                        </div>
                    </div>
                </div>
        `
    document.getElementById("list").insertAdjacentHTML('beforeend', code)
}
