var teaserdata,
    teaser_location = [[2, 3], [4, 1], [5, 4], [6, 2], [1, 0], [3, 5], [6, 6], [4, 0]],
    teaser_background = ["#F1B1A4", "#8073bf", "#ADDCF0", "#6B4057", "#FFC375", "#648045"],
    teaser_fill = ["#161616", "#FFFFFF", "#161616", "#FFFFFF", "#161616", "#FFFFFF"],
    teaser_padding = 60,
    linkGen = d3.linkVertical(),
    pairdata = [];

var teaser_answer_choices = [];

var teaserObjects, teaserBackground, teaserFill;

d3.json("homepage_data/selected_teaser_chain_dict.json").then(function (d) {
    Object.keys(d).forEach(function (n) {
        let name = "";
        let i = 0;
        while (n[i] !== "_") {
            name += n[i];
            i++;
        }
        console.log(name);
        document.getElementById("teaser_buttons").innerHTML += "<button id='p_sel" + n + "'>" + name + "</button>";
        document.getElementById("p_sel" + n).setAttribute("onmouseover", "render_teaser('" + n + "')");
    })

    render_teaser(Object.keys(d)[0]);
});

function render_teaser(file) {

    d3.json("homepage_data/selected_teaser_chain_dict.json").then(function (teaser) {

        Object.keys(teaser).forEach(function (d) {
            if (d == file) {
                document.getElementById("p_sel" + d).className = "active";
            } else {
                document.getElementById("p_sel" + d).className = "";
            }
        })

        teaserdata = teaser[file];
        teaserObjects = [], teaserActions = {};

        Object.keys(teaserdata.situations).forEach(function (d, i) { // d = teaser screen ID

            teaserdata.situations[d].actions.forEach(function (a) {
                if (teaserActions[a] == undefined) {
                    teaserActions[a] = {
                        start: i,
                        duration: 1
                    }
                } else {
                    teaserActions[a].duration++;
                }
            });

            teaserdata.situations[d].rel_pairs.forEach(function (p) {
                if (!teaserObjects.includes(p[0])) {
                    teaserObjects.push(p[0]);
                }
                if (!teaserObjects.includes(p[1])) {
                    teaserObjects.push(p[1]);
                }
            });

        });

        document.getElementById("preview_actions_description").innerHTML = "<br>Situation Hypergraph";

        let action_increment = (document.getElementById("preview_actions").offsetWidth - 30) / Object.keys(teaserdata.situations).length;

        document.getElementById("preview_actions").innerHTML = "";

        Object.keys(teaserActions).forEach(function (a) {
            let action_div = document.createElement("div");
            action_div.style.marginLeft = action_increment * teaserActions[a].start + "px";
            action_div.style.width = action_increment * teaserActions[a].duration + "px";
            action_div.innerHTML = "<div class='actionbottom'>" + a + "</div><div class='actiontop'></div>";
            document.getElementById("preview_actions").append(action_div);
        })

        teaserBackground = d3.scaleOrdinal()
            .domain(teaserObjects)
            .range(teaser_background);

        teaserFill = d3.scaleOrdinal()
            .domain(teaserObjects)
            .range(teaser_fill);

        document.getElementById("preview_screens").innerHTML = "";
        document.getElementById("preview_network").innerHTML = "";

        Object.keys(teaserdata.situations).forEach(function (d) { // d = teaser screen ID

            // create teaser screen div
            let teaser_screen = document.createElement("div");
            teaser_screen.className = "t_screen";
            teaser_screen.innerHTML = "<img id='preview" + d + "' src='homepage_data/" + teaserdata.video_id + "/" + d + ".png'>";

            let teaser_networks = document.createElement("div");
            teaser_networks.className = "t_screen";
            teaser_networks.innerHTML = "<div id='previewnetwork" + d + "'></div>";


            // append teaser screen and adjust height
            document.getElementById("preview_screens").appendChild(teaser_screen);
            document.getElementById("preview_network").appendChild(teaser_networks);
            document.getElementById("preview" + d).style.width = "calc(100% - 5px)";

            let teaser_objects = [],
                teaser_width = document.getElementById("preview_screens").offsetWidth / (Object.keys(teaserdata.situations).length) - 5;

            teaserdata.situations[d].rel_pairs.forEach(function (p) {
                if (!teaser_objects.includes(p[0])) {
                    teaser_objects.push(p[0]);
                }
                if (!teaser_objects.includes(p[1])) {
                    teaser_objects.push(p[1]);
                }
            });

            let teaser_network = d3.select("#previewnetwork" + d)
                .append("svg")
                .attr("width", teaser_width)
                .attr("height", 210)
                .attr("transform", "translate(-" + teaser_padding / 3 + ", 0)")

            let tX = [],
                tY = [];

            teaser_objects.forEach(function (a, i) {
                tX.push(teaser_location[i][0]);
                tY.push(teaser_location[i][1]);
            });

            let tXScale = d3.scaleLinear()
                .domain(d3.extent(tX))
                .range([teaser_padding / 1.5, teaser_width - teaser_padding]);

            let tYScale = d3.scaleLinear()
                .domain(d3.extent(tY))
                .range([teaser_padding / 1.5, 200]);

            for (let i = 0; i < tX.length; i++) {
                tX[i] = tXScale(tX[i]);
                tY[i] = tYScale(tY[i]);
            }

            let teaserX = d3.scaleOrdinal()
                .domain(teaser_objects)
                .range(tX);

            let teaserY = d3.scaleOrdinal()
                .domain(teaser_objects)
                .range(tY);

            let t_pair = [],
                t_label = [],
                t_array = [];

            teaserdata.situations[d].rel_pairs.forEach(function (a, i) {
                if (!t_array.includes(a[0] + a[1])) {
                    t_pair.push(teaserdata.situations[d].rel_pairs[i]);
                    t_label.push(teaserdata.situations[d].rel_labels[i]);
                    t_array.push(a[0] + a[1]);
                    t_array.push(a[1] + a[0]);
                } else {
                    t_pair.forEach(function (b, n) {
                        if ((b[0] == a[0] && b[1] == a[1]) || (b[1] == a[0] && b[0] == a[1])) {
                            t_label[n] += " | " + teaserdata.situations[d].rel_labels[i];
                        }
                    })
                }
            });

            pairdata = [];
            t_pair.forEach(function (pair) {
                pairdata.push({
                    source: [teaserX(pair[0]), teaserY(pair[0])],
                    target: [teaserX(pair[1]), teaserY(pair[1])],
                    sourceName: pair[0],
                    targetName: pair[1]
                })
            })

            teaser_network
                .selectAll(".linkGen")
                .data(pairdata)
                .join("path")
                .attr("d", linkGen)
                .attr("class", function (a) {
                    return "tsr linkGen teaser_edge" + d + " t_edge" + d + a.sourceName.replace(/[^\w\s]/gi, '') + " t_edge" + d + a.targetName.replace(/[^\w\s]/gi, '')
                })
                .style("fill", "none")
                .style("stroke-width", 2)
                .style("stroke", "var(--gray)");

            teaser_network
                .selectAll(".teaser_edge")
                .data(t_pair)
                .enter()
                .append("text")
                .attr("class", function (a) {
                    return "tsr teaser_edge_text" + d + " t_edge_text" + d + a[0].replace(/[^\w\s]/gi, '') + " t_edge_text" + d + a[1].replace(/[^\w\s]/gi, '');
                })
                .attr("x", function (a) {
                    return (teaserX(a[0]) + teaserX(a[1])) / 2;
                })
                .attr("y", function (a) {
                    return (teaserY(a[0]) + teaserY(a[1])) / 2;
                })
                .text(function (a, i) {
                    return t_label[i];
                })
                .style("fill", "var(--main)")
                .style("text-anchor", "middle")
                .style("font-size", 10)

            teaser_network
                .selectAll(".teaser_rect")
                .data(teaser_objects)
                .enter()
                .append("rect")
                .attr("class", function (a) {
                    return "tsr teaser_rect" + d + " t_rect" + d + a.replace(/[^\w\s]/gi, '');
                })
                .attr("rx", 10)
                .attr("ry", 10)
                .style("fill", function (a) {
                    return teaserBackground(a);
                });

            teaser_network
                .selectAll(".teaser_text")
                .data(teaser_objects)
                .enter()
                .append("text")
                .attr("class", function (a) {
                    return "tsr teaser_text" + d + " t_text" + d + a.replace(/[^\w\s]/gi, '');
                })
                .text(function (a) {
                    return a;
                })
                .attr("x", function (a) {
                    return teaserX(a);
                })
                .attr("y", function (a) {
                    return teaserY(a);
                })
                .style("text-anchor", "middle")
                .style("font-size", "12px")
                .style("fill", function (a) {
                    return teaserFill(a);
                })

            teaser_network.selectAll(".teaser_rect" + d)
                .data(teaser_objects)
                .attr("x", function (a) {
                    return teaserX(a) - document.getElementsByClassName("t_text" + d + a.replace(/[^\w\s]/gi, ''))[0].getBBox().width / 2 - 10;
                })
                .attr("y", function (a) {
                    return teaserY(a) - 13;
                })
                .attr("width", function (a) {
                    return document.getElementsByClassName("t_text" + d + a.replace(/[^\w\s]/gi, ''))[0].getBBox().width + 20;
                })
                .attr("height", 18)

        });

        // run array of answer choices
        let teaser_choices = "";
        teaser_answer_choices = [];
        teaserdata.choices.forEach(function (d, i) {
            teaser_answer_choices.push(d.choice);
            teaser_choices += "<button onmouseover='teaser_choice(" + i + ")'>" + d.choice + "</button>";
        })

        // append questions
        document.getElementById("preview_choice").innerHTML =
            "<h4 id='preview_question'>" + teaserdata.question + "</h4>" +
            "<div id='preview_answers'>" +
            teaser_choices +
            "<div class='t_response'></div></div>";

        document.getElementById("preview_description").innerHTML = "QID: <b>" + teaserdata.question_id + "</b>, " + Object.keys(teaserdata.situations).length + " sampled keyframes.";

    })
};

function teaser_choice(a) {

    d3.selectAll(".tsr").style("opacity", 1);

    Object.keys(teaserdata.choices[a].chain).forEach(function (n) {

        if (teaserdata.choices[a].chain[n].rel_labels[0] == undefined) {

            document.getElementById("preview" + n).style.opacity = 0.3;

            d3.selectAll(".teaser_rect" + n)
                .style("opacity", 0.1);
            d3.selectAll(".teaser_edge_text" + n)
                .style("opacity", 0.1);
            d3.selectAll(".teaser_edge_circle" + n)
                .style("opacity", 0.1);
            d3.selectAll(".teaser_edge" + n)
                .style("opacity", 0.1);
            d3.selectAll(".teaser_text" + n)
                .style("opacity", 0.1);

        } else {

            document.getElementById("preview" + n).style.opacity = 1;
            let tsrobj = teaserObjects;

            let t_pairs = [];

            teaserdata.choices[a].chain[n].rel_pairs.forEach(function (r) {
                if (tsrobj.includes(r[0])) {
                    tsrobj = tsrobj.filter(function (t) {
                        return t !== r[0];
                    })
                }
                if (tsrobj.includes(r[1])) {
                    tsrobj = tsrobj.filter(function (t) {
                        return t !== r[1];
                    })
                }
            })

            tsrobj.forEach(function (obj) {

                d3.selectAll(".t_rect" + n + obj.replace(/[^\w\s]/gi, ''))
                    .style("opacity", 0.1);
                d3.selectAll(".t_edge_text" + n + obj.replace(/[^\w\s]/gi, ''))
                    .style("opacity", 0.1);
                d3.selectAll(".t_edge_circle" + n + obj.replace(/[^\w\s]/gi, ''))
                    .style("opacity", 0.1);
                d3.selectAll(".t_edge" + n + obj.replace(/[^\w\s]/gi, ''))
                    .style("opacity", 0.1);
                d3.selectAll(".t_text" + n + obj.replace(/[^\w\s]/gi, ''))
                    .style("opacity", 0.1);

            });


        };
    });

    teaserdata.choices.forEach(function (b, i) {

        if (i == a) {
            if (teaserdata.choices[i].answer == "Wrong") {
                document.getElementById("preview_answers").childNodes[i].className = "preview_incorrect";
                document.getElementById("preview_answers").childNodes[i].innerHTML = teaser_answer_choices[a] + "<i class='fa fa-times-circle'></i>";
            } else {
                document.getElementById("preview_answers").childNodes[i].className = "preview_correct";
                document.getElementById("preview_answers").childNodes[i].innerHTML = teaser_answer_choices[a] + "<i class='fa fa-check-circle'></i>";
            };
        } else {
            document.getElementById("preview_answers").childNodes[i].className = "";
            document.getElementById("preview_answers").childNodes[i].innerHTML = teaser_answer_choices[i];
        }
    });
};
