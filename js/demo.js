function load_data() {

    d3.json("homepage_data/selected_examples.json").then(function (raw_data) {

        video_names.forEach(function (d) {
            data[d] = {
                questions: [],
                frame_id: [],
                frames_all: {},
                box_all: [],
                pair_all: []
            }
            relCheck[d] = {
                all: []
            };
        });

        raw_data.forEach(function (d) {

            // push question under the corresponding video ID
            data[d.video_id].questions.push(d);

            // process data for each frame in a situation
            Object.keys(d.situations).forEach(function (n) {

                // if first time data for a certain frame is present...
                if (!data[d.video_id].frame_id.includes(n)) {
                    // add frame ID to ID Array
                    data[d.video_id].frame_id.push(n);
                    data[d.video_id].frames_all[n] = {
                        bbox: {},
                        rel: []
                    };
                    relCheck[d.video_id][n] = [];
                };


                // for all detected object in a frame
                d.situations[n].bbox.forEach(function (b, i) {

                    // provide bounding box for object at specific frame
                    if (data[d.video_id].frames_all[n].bbox[d.situations[n].bbox_labels[i]] == undefined) {

                        if (b == null) {
                            b = [0, 0, 0, 0];
                        };

                        data[d.video_id].frames_all[n].bbox[d.situations[n].bbox_labels[i]] = {
                            x: b[0],
                            y: b[1],
                            w: b[2] - b[0],
                            h: b[3] - b[1]
                        }
                    };

                    // add object ID to box_all
                    if (!data[d.video_id].box_all.includes(d.situations[n].bbox_labels[i])) {
                        data[d.video_id].box_all.push(d.situations[n].bbox_labels[i]);
                    };

                })


                d.situations[n].rel_pairs.forEach(function (b, i) {

                    // provide bounding box for object at specific frame
                    if (!relCheck[d.video_id][n].includes(b[0].toString() + "to" + b[1].toString())) {
                        data[d.video_id].frames_all[n].rel.push(b);
                        relCheck[d.video_id][n].push(b[0].toString() + "to" + b[1].toString())
                    };

                    // add rel to pair_all
                    if (!relCheck[d.video_id].all.includes(b[0].toString() + "to" + b[1].toString())) {
                        data[d.video_id].pair_all.push(b)
                        relCheck[d.video_id].all.push(b[0].toString() + "to" + b[1].toString());
                    };

                })

            })

        })

        render_example(video_names[3]);
    })

};

function render_example(id) {

    // reset html in case of any residue from earlier hovers
    document.getElementById("frames").innerHTML = "";

    video_data = data[id];
    chosen_video = id;

    frames = video_data.frame_id.sort(function (x, y) {
        return d3.ascending(x, y);
    })

    frames.forEach(function (d, i) {
        let frame = document.createElement("div");
        frame.className = "frames";
        frame.setAttribute("onmouseover", "example_focus(" + i + ", '" + d + "')");
        frame.id = "frame" + i;
        frame.style.display = "inline-block";
        frame.style.width = (width - 150) / (frames.length - 1) + "px";
        frame.style.height = video_height + "px"
        frame.style.backgroundImage = "url('homepage_data/" + id + "/" + d + ".png')";
        frame.style.opacity = 0.3;
        document.getElementById("frames").appendChild(frame);
    })

    document.getElementById("focused_network").innerHTML = "<div>" +
        "<img id='preview_img' src='homepage_data/" + chosen_video + "/" + frames[0] + ".png'>" +
        "<div id='preview_network'></div></div>";

    let focused_network_width = document.getElementById("focused_network").offsetWidth;

    img_width = document.getElementById("preview_img").naturalWidth;
    img_height = document.getElementById("preview_img").naturalHeight;
    frame_width = (document.getElementById("focused_network").offsetWidth - 30) - 300;
    frame_height = img_height * (frame_width / img_width);

    document.getElementById("preview_img").setAttribute("width", frame_width);
    document.getElementById("preview_img").setAttribute("height", frame_height);
    
    example_focus(0, frames[0]);
};

function example_focus(n, id) {
    
    document.getElementById("preview_img").src = "homepage_data/" + chosen_video + "/" + id + ".png";

    // return current frame to narrow and faded view
    document.getElementById("frame" + focused_frame).style.width = (width - 150) / (frames.length - 1) + "px";
    document.getElementById("frame" + focused_frame).style.opacity = 0.3;
    document.getElementById("frame" + focused_frame).style.border = "solid 1px var(--background_gray)";

    // expand hovered frame;
    document.getElementById("frame" + n).style.width = "150px";
    document.getElementById("frame" + n).style.opacity = 1;
    document.getElementById("frame" + n).style.border = "solid 5px var(--background)";

    // move top tooltip to position;
    document.getElementById("focused").style.marginLeft = ((width - 150) / (frames.length - 1)) * n + "px";
    document.getElementById("focused_secondary").style.marginLeft = ((width - 150) / (frames.length - 1)) * n + "px";
    document.getElementById("focused_tooltip").innerHTML = "frame: " + id;
    

    // set focused frame for next time the mouse hovers
    focused_frame = n;
};

function render_network(id) {

    video_data = data[id];

    d3.json("homepage_data/obj_rel_cls_dict.json").then(function (dict) {

        video_data.box_all.forEach(function (d, i) {
            network_data.nodes.push({
                id: dict.object[d],
                name: dict.object[d],
                num: d
            })
        })

        video_data.pair_all.forEach(function (d, i) {
            network_data.links.push({
                source: dict.object[d[0]],
                target: dict.object[d[1]]
            })
        });

        simulation = d3.forceSimulation()
            .nodes(network_data.nodes),
            link_force = d3.forceLink(network_data.links)
            .id(function (d) {
                return d.name;
            }),
            collide_force = d3.forceCollide().radius(network_height),
            charge_force = d3.forceManyBody().strength(-20),
            center_force = d3.forceCenter(width / 2, network_height / 2);

        simulation
            .force("charge_force", charge_force)
            .force("center_force", center_force)
            .force('collision', collide_force)
            .force("links", link_force)
            .on("tick", tick);

        link = svg.append("g")
            .selectAll("line")
            .data(network_data.links)
            .enter()
            .append("line")
            .attr("class", function (d) {
                return "linksid"
            })
            .attr("stroke-width", 1)
            .style("stroke", function (d) {
                return "lightgray";
            });

        background = svg.append("g")
            .selectAll("circle")
            .data(network_data.nodes)
            .enter()
            .append("circle")
            .attr("class", function (d) {
                return "nodes id" + d.id
            })
            .attr("r", 1)
            .style("fill", "red");

        label = svg.append("g")
            .selectAll("text")
            .data(network_data.nodes)
            .enter()
            .append("text")
            .text(function (d) {
                return d.name;
            })
            .style("text-anchor", "middle")
            .style("alignment-baseline", "middle")
            .style("fill", "var(--main)");

        function tick() {

            label
                .attr("x", function (d) {
                    return d.x = Math.max(80, Math.min(width - 80, d.x));
                })
                .attr("y", function (d) {
                    return d.y = Math.max(50, Math.min(network_height - 50, d.y));
                });

            background
                .attr("cx", function (d) {
                    return d.x = Math.max(80, Math.min(width - 80, d.x));
                })
                .attr("cy", function (d) {
                    return d.y = Math.max(50, Math.min(network_height - 50, d.y));
                })
                .attr("r", 5);

            link
                .attr("x1", function (d) {
                    return d.source.x;
                })
                .attr("y1", function (d) {
                    return d.source.y;
                })
                .attr("x2", function (d) {
                    return d.target.x;
                })
                .attr("y2", function (d) {
                    return d.target.y;
                });
        };

    });

};

load_data();
