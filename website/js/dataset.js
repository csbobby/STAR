var mini;
var exampledata = [],
    raw_data = [];

d3.json("data/sel_v2.json").then(function (raw_d) {
    
    Object.keys(raw_d).forEach(function(d){
        raw_data.push(raw_d[d]);
    })
    
    console.log(raw_d);

    raw_data = raw_data.sort(function (a, b) {
        return d3.ascending(a.video_id, b.video_id);
    })

    raw_data.forEach(function (d, i) {

        exampledata.push(d);
        mini = document.createElement("div");
        mini.className = "dataset_demo";
        mini.setAttribute("onmouseover", "mouseoverdata(" + i + ")");
        mini.setAttribute("onmouseout", "mouseoutdata()");
        mini.id = "id" + i;
        mini.style.backgroundImage = "url('data/" + d.video_id + "/" + Object.keys(d.situations)[0] + ".png')"

        document.getElementById("dataset").appendChild(mini);
    })

});

function mouseoverdata(id) {

    let e = exampledata[id],
        c_answer = "<i class='fa fa-check-circle'></i>",
        w_answers = "<i class='fa fa-times-circle'></i>",
        e_images = "";

    console.log(e.video_id);

    for (let i = 0; i < 11; i++) {
        e_images += "<img src='data/" + e.video_id + "/" + Object.keys(e.situations)[i] + ".png'>"
    }

    e_images += "..."


    e.choices.forEach(function (d) {
        if (d.answer == "Correct") {
            c_answer += " | " + d.choice;
        } else {
            w_answers += " | " + d.choice
        }
    })

    document.getElementById("demotooltip").innerHTML = "<p class='e_a'>" + e.question_id + " | type: " + e.subtype + "</p>" +
        "<p class='e_q'>" + e.question + "</p>" +
        "<p class='e_a'>Keyword(s): " + e.question_keyword.join(" | ") + "</p>" +
        "<p class='e_c'><br>" + c_answer + " (Keyword(s): " + e.answer_keyword.join(" | ") + ")</p>" +
        "<p class='e_a'>" + w_answers + "</p><hr>" +
        "<div class='e_images'><div id='e_images'>" + e_images + "</div><p>including a total of " + Object.keys(e.situations).length + " frames.</p></div>";

    let mouseX = document.getElementById("id" + id).getBoundingClientRect().left,
        mouseY = document.getElementById("id" + id).getBoundingClientRect().top;

    exampledata.forEach(function (d, i) {
        if (i !== id) {
            document.getElementById("id" + i).style.opacity = 0.2;
        } else {
            document.getElementById("id" + i).style.opacity = 1;
        }
    })

    document.getElementById("demotooltip").style.left = mouseX - 175 + "px";
    document.getElementById("demotooltip").style.top = mouseY + 70 + "px";
};

function mouseoutdata() {

    exampledata.forEach(function (d, i) {
        document.getElementById("id" + i).style.opacity = 1;
    })

    document.getElementById("demotooltip").style.left = "-5000px";
    document.getElementById("demotooltip").innerHTML = "";
}
