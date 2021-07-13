var svgWidth = 850;
var svgHeight = 600;

var margin = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  
// Chart data — id,state,abbr,poverty,povertyMoe,age,ageMoe,income,incomeMoe,healthcare,healthcareLow,healthcareHigh,obesity,obesityLow,obesityHigh,smokes,smokesLow,smokesHigh,-0.385218228

// Import Data
d3.csv("assets/data/data.csv").then(function(censusData) {

    // Parse my data and cast as numbers
    censusData.forEach(function(data) {
      data.income = +data.income;
      data.smokes = +data.smokes;
      
    });

    // Create scale functions
    var xLinearScale = d3.scaleLinear()
      .domain([35000, d3.max(censusData, d => d.income)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([5, d3.max(censusData, d => d.smokes)])
      .range([height, 0]);

    // Create axis functions
    var bottomAxis1 = d3.axisBottom(xLinearScale);
    var leftAxis1 = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis1);

    chartGroup.append("g")
      .call(leftAxis1);

    // Create circles
    chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.income))
    .attr("cy", d => yLinearScale(d.smokes))
    .attr("r", 12)
    .attr("fill", "#65a9c9")
    .attr("opacity", ".65");

    // Label circles 
    chartGroup.selectAll("null").data(censusData).enter().append("text")
      .attr("x", d => xLinearScale(d.income))
      .attr("y", d => yLinearScale(d.smokes) + 5)
      .text(d => d.abbr)
      .attr("font-family", "sans-serif")
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .attr("text-anchor", "middle")
      .attr("fill", "white");

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left / 2)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .classed("active", true)
      .text("Smokes (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .classed("active", true)
      .text("Household Income (Median)");
  }).catch(function(error) {
    console.log(error);
});

