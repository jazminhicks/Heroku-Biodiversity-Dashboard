 function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then(function(sampleMetadata) {
    
    console.log(sampleMetadata);
    // Use d3 to select the panel with id of `#sample-metadata`
    var sample_metadata = d3.select("#sample-metadata");
  
    // Use `.html("") to clear any existing metadata
    sample_metadata.html("");

    var data_list = sample_metadata.append("dl");

    // Use `Object.entries` to add each key and value pair to the panel
    Object.entries(sampleMetadata).forEach(([key, value]) => {
      console.log(key, value);

      data_list.append("p").text(`${key} : ${value}`);


    })
    

    // BONUS: Build the Gauge Chart
    //buildGauge(sampleMetadata.WFREQ);
    

    /*var gaugeData = [{
      hole: 0.4, 
      type: 'pie', 
      marker: {
        colors: ['', '', '', '', '', '', '', '', '', 'white'], 
        //hoverinfo: 'label', 
        labels: ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9']
      }, 
      text: ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9'], 
      rotation: 90, 
      textinfo: 'text', 
      direction: 'clockwise', 
      values: [9, 9, 9, 9, 9, 9, 9, 9, 9, 81], 
      showlegend: false, 
      textposition: 'inside'


    }];*/

    /*var gaugeLayout = {
      xaxis: {
        range: [-1, 1], 
        visible: false
      }, 
      yaxis: {
        range: [-1, 1], 
        visible: false
      }, 
      shapes: [
        {
          x0: 0.5, 
          x1: 0.6, 
          y0: 0.5, 
          y1: 0.6, 
          line: {
            color: 'black', 
            width: 3
          }, 
          type: 'line'
        }
      ], 
      autosize: false,
    };*/
    var gaugeData = [{
      domain : {
        x : [0, 1],
        y : [0, 1]
      },
      value: sampleMetadata.WFREQ,
      title : {
        text : "<b>Belly Button Washing Frequency</b> <br>Scrubs per Week</br>"
      },
      type : "indicator", 
      mode : "gauge+number",
      gauge : {
        axis : {range : [null, 9]}
      }
    }];

    var gaugeLayout = {
      width : 500,
      height : 500
    };
    
    Plotly.react("gauge", gaugeData, gaugeLayout);
  }
  
)}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function(sampleData) {
    console.log(sampleData);

    // Build a Bubble Chart using the sample data
    var bubbleData = [{
      x : sampleData.otu_ids,
      y : sampleData.sample_values,
      text : sampleData.otu_labels,
      mode : 'markers',
      marker : {
        color : sampleData.otu_ids,
        size : sampleData.sample_values
      }
    }];

    var bubbleLayout = {
      showlegend : false,
      xaxis :{
        title : "OTU ID"
      }
    };

    Plotly.react("bubble", bubbleData, bubbleLayout);

    // Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

    var pieData = [{
      values : sampleData.sample_values.slice(0, 10),
      labels : sampleData.otu_ids.slice(0, 10),
      hovertext : sampleData.otu_labels.slice(0, 10),
      type : 'pie'
    }];

    var pieLayout = {};

    Plotly.react("pie", pieData, pieLayout);

    }
    
  )}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
