function init() {
  var selector = d3.select("#selDataset");

  d3.json("samples.json").then((data) => {
    console.log(data);
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    buildMetadata(sampleNames[0]);
    buildCharts(sampleNames[0]);

})}

function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");
    PANEL.append("h6").text('ID: '.concat(result.id));
    PANEL.append("h6").text('ETHNICITY: '.concat(result.ethnicity));
    PANEL.append("h6").text('GENDER: '.concat(result.gender));
    PANEL.append("h6").text('AGE: '.concat(result.age));
    PANEL.append("h6").text('LOCATION: '.concat(result.location));
    PANEL.append("h6").text('BBTYPE: '.concat(result.bbtype));
    PANEL.append("h6").text('WFREQ: '.concat(result.wfreq));
  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array.
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = resultArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    otu_ids = result.otu_ids;
    otu_labels = result.otu_labels;
    sample_values = result.sample_values;

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order
    //  so the otu_ids with the most bacteria are last.

    var sorted_sample_values = sample_values.sort((a,b) => b - a);
    var top_sample_values = sorted_sample_values.slice(0,10);
    var rev_top_sample_values = top_sample_values;
    var sorted_otu_labels = otu_labels.sort((a, b) => b - a);
    var top_otu_labels = sorted_otu_labels.slice(0,10);

    var otu_id_list = otu_ids.slice(0,10);

    var yticks = otu_id_list.map(object => 'OTU_'.concat(object.toString()));
    console.log(yticks);
    console.log(rev_top_sample_values);
    console.log(top_otu_labels);

    // 8. Create the trace for the bar chart.
    var barData = [{
          x: rev_top_sample_values,
          y: yticks,
          text: top_otu_labels.map(object => object.split(";").sort().join(";")),
          type: "bar",
          orientation: 'h'
    }];
    // 9. Create the layout for the bar chart.
    var barLayout = {
          title: "Top 10 Bacteria Cultures Found"
    };
    // 10. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bar", barData, barLayout);

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: "markers",
          marker: {
              color: ['rgb(93, 164, 214)', 'rgb(255, 144, 14)',  'rgb(44, 160, 101)', 'rgb(255, 65, 54)'],
              size: sample_values,
              sizeref: 2
            }
    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
        title: "Bacteria Cultures Per Sample"
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

  });
}

function optionChanged(newSample) {
  buildMetadata(newSample);
  buildCharts(newSample);
}

init();