var video_ids = [],
    demodata = [];

d3.json("homepage_data/selected_examples_keyframes_dict.json").then(function (raw_d) {

    Object.keys(raw_d).forEach(function (d) {
        if (!video_ids.includes(raw_d[d].video_id)) {
            video_ids.push(raw_d[d].video_id);
        };

        demodata.push({
            id: d,
            data: raw_d[d]
        })
    })

    video_ids.forEach(function (vid) {
        let questions = demodata.filter(function (d) {
            return d.data.video_id == vid;
        });

//        questions.sort(function (a, b) {
//            return d3.ascending(a.id, b.id);
//        });

        document.getElementById("videos").innerHTML += "<button class='demobutton' id='button" + vid + "'>" + vid + "</button>";
        document.getElementById("button" + vid).setAttribute("onmouseover", "focus_demo('" + vid + "')");

        document.getElementById("video_details").innerHTML += "<div id='video" + vid + "' class='e_images'><div style='min-width: 300px; background: var(--background); margin-right: 20px;'><video width='100%' controls muted loop autoplay><source src='https://star-benchmark.s3.us-east.cloud-object-storage.appdomain.cloud/homepage/trimmed_video_clips/" + questions[0].id + ".mp4' type='video/mp4'></video></div><div class='demo_info' id='demo" + vid + "'></div></div>";

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
//                "<p class='e_a'>Keyword(s): " + e.data.question_keyword.join(" | ") + "</p>" + 
                "</div>" +
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
};
