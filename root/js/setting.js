//var video_names = ["0BNML", "0TXYV", "LEG82", "TJZ0P"],
//    data = {},
//    chosen_video,
//    relCheck = {},
//    video_data, frames, focused_frame = 0,
//    network_data = {
//        nodes: [],
//        links: []
//    },
//    video_size = {
//        "0BNML": [480, 318],
//        "0TXYV": [480, 270],
//        "LEG82": [480, 360],
//        "TJZ0P": [480, 270]
//    };
//
//var width = document.getElementById("frames").offsetWidth,
//    video_height = document.getElementById("frames").offsetHeight,
//    network_height = document.getElementById("selected").offsetHeight,
//    svg = d3.select("#selected")
//    .append("svg")
//    .attr("width", width)
//    .attr("height", network_height)
//    .append("g")
//
//var simulation, link_force, collide_force, charge_force, center_force, link, label, background;
//
//var frame_width, frame_height, img_width, img_height;