// ==============================
// BONUS Chart 
// ==============================
var svgWidth1 = 850;
var svgHeight1 = 600;

var margin1 = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 100
};

var width1 = svgWidth1 - margin1.left - margin1.right;
var height1 = svgHeight1 - margin1.top - margin1.bottom;


var svg1 = d3.select("#scatter1")
  .append("svg")
  .attr("width", svgWidth1)
  .attr("height", svgHeight1);

// Append an SVG group
var chartGroup1 = svg1.append("g")
  .attr("transform", `translate(${margin1.left}, ${margin1.top})`);

// Initial Params
var chosenXAxis = "income";

// function used for updating x-scale var upon click on axis label
function xScale(censusData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenXAxis]) * 0.8,
      d3.max(censusData, d => d[chosenXAxis]) * 1.2])
    .range([0, width1]);

  return xLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup1, newXScale, chosenXAxis) {

  circlesGroup1.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
  return circlesGroup1;
  
}
// Function for updating the state abbr of the circles
function renderCirclesLabels(circlesData, newXScale, chosenXAxis) {

  circlesData.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]));
  return circlesData;
  
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup1) {

  var label;

  if (chosenXAxis === "income") {
    label = "Income: $";
  }
  else if (chosenXAxis === "poverty") {
    label = "In Poverty: ";
  }
  else {
    label = "Median Age: ";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -50])
    .html(function(d) {
      return (`<strong>${d.state}</strong><br>Obesity: ${d.obesity}%<br>${label}${d[chosenXAxis]}`);
    });

  circlesGroup1.call(toolTip);

  circlesGroup1.on("mouseover", function(d) {
    toolTip.show(d, this);
  })
    // onmouseout event
    .on("mouseout", function(d) {
      toolTip.hide(d);
    });

  return circlesGroup1;
}

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(censusData, err) {
  if (err) throw err;

  // parse data
  censusData.forEach(function(data) {
    data.income = +data.income;
    data.obesity = +data.obesity;
    data.age = +data.age;
    data.poverty = +data.poverty;
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(censusData, chosenXAxis);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d.obesity) - 3, d3.max(censusData, d => d.obesity) + 1])
    .range([height1, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup1.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height1})`)
    .call(bottomAxis);

  // append y axis
  chartGroup1.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup1 = chartGroup1.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", 12)
    .attr("fill", "#65a9c9")
    .attr("opacity", ".65");
  
  // Label circles with state abbr 
  var circlesData = chartGroup1.selectAll("null").data(censusData).enter().append("text")
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d.obesity) + 5)
    .text(d => d.abbr)
    .attr("font-family", "sans-serif")
    .attr("font-size", "12px")
    .attr("font-weight", "bold")
    .attr("text-anchor", "middle")
    .attr("fill", "white");
  
    // Create group for two x-axis labels
  var labelsGroup = chartGroup1.append("g")
    .attr("transform", `translate(${width1 / 2}, ${height1 + 20})`);

  var incomeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 15)
    .attr("value", "income") // value to grab for event listener
    .classed("active", true)
    .text("Household Income (Median)");

  var ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 35)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");
  
  var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 55)
    .attr("value", "poverty") // value to grab for event listener
    .classed("inactive", true)
    .text("Poverty (%)");

  // append y axis
  chartGroup1.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin1.left / 2)
    .attr("x", 0 - (height1 / 2))
    .attr("dy", "1em")
    .classed("active", true)
    .text("Obesity (%)");

  // updateToolTip function above csv import
  var circlesGroup1 = updateToolTip(chosenXAxis, circlesGroup1);
  

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
    
      // get value of selection
      var value = d3.select(this).attr("value");
      
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        // console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(censusData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup1 = renderCircles(circlesGroup1, xLinearScale, chosenXAxis);

        // Label circles 
        circlesData = renderCirclesLabels(circlesData, xLinearScale, chosenXAxis);
        
        // updates tooltips with new info
        circlesGroup1 = updateToolTip(chosenXAxis, circlesGroup1);

        
        // changes classes to change bold text
        if (chosenXAxis === "age") {
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis === "poverty") {
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      
      }
    });
}).catch(function(error) {
  console.log(error);
});