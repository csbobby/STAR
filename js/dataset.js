var video_ids = [],
    demodata = [];

d3.json("data/selected_examples_keyframes_dict.json").then(function (raw_d) {

    Object.keys(raw_d).forEach(function (d) {
        if (!video_ids.includes(raw_d[d].video_id)) {
            video_ids.push(raw_d[d].video_id);
        };

        demodata.push({
            id: d,
            data: raw_d[d]
        })
    })

    console.log(demodata);

    video_ids.forEach(function (vid) {
        let questions = demodata.filter(function (d) {
            return d.data.video_id == vid;
        });

        questions.sort(function (a, b) {
            return d3.ascending(a.id, b.id);
        });

        document.getElementById("videos").innerHTML += "<button class='demobutton' id='button" + vid + "'>" + vid + "</button>";
        document.getElementById("button" + vid).setAttribute("onmouseover", "focus_demo('" + vid + "')");

        let e_images = "<video width='100%' controls muted loop autoplay><source src='https://stardata.s3.amazonaws.com/homepage/trimmed_video_clips/" + questions[0].id + ".mp4' type='video/mp4'></video>";

        document.getElementById("video_details").innerHTML += "<div id='video" + vid + "' class='e_images'>" + e_images + "</div><div class='demo_info' id='demo" + vid + "'></div>";

        questions.forEach(function (e) {

            let answers = "";

            e.data.choices.forEach(function (d) {
                if (d.answer == "Correct") {
                    answers += "<span><i class='fa fa-check-circle'></i> " + d.choice + "</span><br>";
                } else {
                    answers += "<span style='opacity: 0.5'><i class='fa fa-times-circle'></i> " + d.choice + "</span><br>";
                }
            })

            document.getElementById("demo" + vid).innerHTML += "<div class='demo_questions'>" +
                "<div><p class='e_a'>" + e.data.question_id + "</p>" +
                "<p class='e_q'>" + e.data.question + "</p>" +
                "<p class='e_a'>Keyword(s): " + e.data.question_keyword.join(" | ") + "</p></div>" +
                "<div><p class='e_c'><br>" + answers + "</p></div></div>";

        });
    })
    
    focus_demo(video_ids[0]);

});


function focus_demo(vid) {
    
    
    d3.selectAll(".demobutton").attr("class", "demobutton");
    d3.selectAll("#button" + vid).attr("class", "demobutton active");
    d3.selectAll(".demo_info").style("display", "none");
    d3.selectAll("#demo" + vid).style("display", "flex");
    d3.selectAll(".e_images").style("display", "none");
    d3.selectAll("#video" + vid).style("display", "flex");
}



//var mini;
//var exampledata = [],
//    raw_data = [];
//
//d3.json("data/sel_v2.json").then(function (raw_d) {
//    
//    Object.keys(raw_d).forEach(function(d){
//        raw_data.push(raw_d[d]);
//    })
//    
//    console.log(raw_d);
//
//    raw_data = raw_data.sort(function (a, b) {
//        return d3.ascending(a.video_id, b.video_id);
//    })
//
//    raw_data.forEach(function (d, i) {
//
//        exampledata.push(d);
//        mini = document.createElement("div");
//        mini.className = "dataset_demo";
//        mini.setAttribute("onmouseover", "mouseoverdata(" + i + ")");
//        mini.setAttribute("onmouseout", "mouseoutdata()");
//        mini.id = "id" + i;
//        mini.style.backgroundImage = "url('data/" + d.video_id + "/" + Object.keys(d.situations)[0] + ".png')"
//
//        document.getElementById("dataset").appendChild(mini);
//    })
//
//});
//
//function mouseoverdata(id) {
//
//    let e = exampledata[id],
//        c_answer = "<i class='fa fa-check-circle'></i>",
//        w_answers = "<i class='fa fa-times-circle'></i>",
//        e_images = "";
//
//    console.log(e.video_id);
//
//    for (let i = 0; i < 11; i++) {
//        e_images += "<img src='data/" + e.video_id + "/" + Object.keys(e.situations)[i] + ".png'>"
//    }
//
//    e_images += "..."
//
//
//    e.choices.forEach(function (d) {
//        if (d.answer == "Correct") {
//            c_answer += " | " + d.choice;
//        } else {
//            w_answers += " | " + d.choice
//        }
//    })
//
//    document.getElementById("demotooltip").innerHTML = "<p class='e_a'>" + e.question_id + " | type: " + e.subtype + "</p>" +
//        "<p class='e_q'>" + e.question + "</p>" +
//        "<p class='e_a'>Keyword(s): " + e.question_keyword.join(" | ") + "</p>" +
//        "<p class='e_c'><br>" + c_answer + " (Keyword(s): " + e.answer_keyword.join(" | ") + ")</p>" +
//        "<p class='e_a'>" + w_answers + "</p><hr>" +
//        "<div class='e_images'><div id='e_images'>" + e_images + "</div><p>including a total of " + Object.keys(e.situations).length + " frames.</p></div>";
//
//    let mouseX = document.getElementById("id" + id).getBoundingClientRect().left,
//        mouseY = document.getElementById("id" + id).getBoundingClientRect().top;
//
//    exampledata.forEach(function (d, i) {
//        if (i !== id) {
//            document.getElementById("id" + i).style.opacity = 0.2;
//        } else {
//            document.getElementById("id" + i).style.opacity = 1;
//        }
//    })
//
//    document.getElementById("demotooltip").style.left = mouseX - 175 + "px";
//    document.getElementById("demotooltip").style.top = mouseY + 70 + "px";
//};
//
//function mouseoutdata() {
//
//    exampledata.forEach(function (d, i) {
//        document.getElementById("id" + i).style.opacity = 1;
//    })
//
//    document.getElementById("demotooltip").style.left = "-5000px";
//    document.getElementById("demotooltip").innerHTML = "";
//}
