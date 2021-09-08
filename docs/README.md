# STAR Homepage

A new benchmark for situated reasoning in real-world videos. 

### Question Type  
* Interaction Question
* Sequence Question
* Prediction Question
* Feasibility Question

### Question, Multiple Choice Answers and Situation Graphs  
 * Questions and Answers (.json) : [Train](https://stardata.s3.amazonaws.com/Question_Answer_SituationGraph/STAR_train.json) [Val](https://stardata.s3.amazonaws.com/Question_Answer_SituationGraph/STAR_val.json) [Test](https://stardata.s3.amazonaws.com/Question_Answer_SituationGraph/STAR_test.json)
 * [Train/Val/Test Split File (.json)](https://stardata.s3.amazonaws.com/Question_Answer_SituationGraph/split_file.json)

### Question-Answer Templates and Programs  
 * [Question Templates (.csv)](https://stardata.s3.amazonaws.com/Templates_Programs/QA_templates.csv)
 * [QA Programs (.csv)](https://stardata.s3.amazonaws.com/Templates_Programs/QA_programs.csv)

### Situation Video Data  
 * [Video Segments (.csv)](https://stardata.s3.amazonaws.com/Situation_Video_Data/Video_Segments.csv)
 * [Video Keyframe IDs (.csv)](https://stardata.s3.amazonaws.com/Situation_Video_Data/Video_Keyframe_IDs.csv)
 * [Frame Dumping Tool from the Action Genome](https://github.com/JingweiJ/ActionGenome)

### Annotations  
 * [Human Poses (.zip)](https://stardata.s3.amazonaws.com/Annotations/pose.zip)
 * [Object Bounding Boxes (.pkl)](https://stardata.s3.amazonaws.com/Annotations/object_bbox_and_relationship.pkl)
 * [Human Bounding Boxes (.pkl)](https://stardata.s3.amazonaws.com/Annotations/person_bbox.pkl)

### Supporting Data  
* Video Frames
  * [Raw Videos from Charades (scaled to 480p)](https://prior.allenai.org/projects/charades)
* Video Features
  * [Visual Features from Charades](https://prior.allenai.org/projects/charades)

### STAR Visulization
We prodive some QA examples in STAR which you can visulize by using [QA Visualization Script](https://github.com/csbobby/STAR_Dataset/tree/main/code)
 * before visualization, please download the Supporting Data (include video keyframes from Action Genome and original videos from Charades) and place them in the mentioned directories in the scripts.

### STAR Generation
We also prodive our QA generation code, you can generate new STAR questions for situation video clips: [QA Generation Code](https://github.com/csbobby/STAR_Dataset/tree/main/code)
