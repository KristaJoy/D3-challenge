var svgWidth = 800;
var svgHeight = 600;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 40
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
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Create circles
    var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.income))
    .attr("cy", d => yLinearScale(d.smokes))
    .attr("r", "12")
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
      .attr("y", 0 - margin.left - 5)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Smokes (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Income ($)");
  }).catch(function(error) {
    console.log(error);
});


// ==============================
// BONUS Chart 
// ==============================
var svgWidth1 = 800;
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

var chartGroup1 = svg1.append("g")
  .attr("transform", `translate(${margin1.left}, ${margin1.top})`);

// Initial params
var chosenXAxis = "income";
var chosenYAxis = "smokes";

// function for x-scale on click 
function xScale(censusData, chosenXAxis){
    var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenXAxis]) * .8,
        d3.max(censusData, d => d[chosenXAxis]) * 1.2])
    .range([0, width1])
    return xLinearScale;
}

// function for y-scale on click
function yScale(censusData, chosenYAxis){
    var yLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d[chosenYAxis]) * .8,
        d3.max(censusData, d => d[chosenYAxis]) * 1.2])
    .range([height1, 0])
    return yLinearScale;
}

// function to update x-axis on click
function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    return xAxis;
}

// function to update y-axis on click
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    return yAxis;
}

// function to update circles group to new circles
function renderCircles(circlesGroup1, newXScale, chosenXAxis, newYScale, chosenYAxis) {
    circlesGroup1.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));
    return circlesGroup1;
}

function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup1) {
    //update for x
    var xlabel;
    if (chosenXAxis === "poverty") {
        xlabel = "Poverty (%)";
    }
    else if (chosenXAxis === "age") {
        xlabel = "Age (Median)";
    }
    else {
        xlabel = "Household Income (Median)";
    }
    //update for y
    var ylabel;
    if (chosenYAxis === "obese") {
        ylabel = "Obese (%)";
    }
    else if (chosenYAxis === "smokes") {
        ylabel = "Smokes (%)";
    }
    else {
        ylabel = "Lacks Healthcare (%))";
    }
    var toolTip = d3.tip() 
        .attr("class", "tooltip")
        .offset([80, 50])
        .html(function(d) {
            return (`${d.state}<br>${xlabel}<br>${ylabel}`)
        });
    
    circlesGroup1.call(toolTip);

    circlesGroup1.on("mouseover", function(data) {
        toolTip.show(data);
    })
        .on("mouseout", function(data, index){
            toolTip.hide(data);
        });

    return circlesGroup1
}

// Chart data — id,state,abbr,poverty,povertyMoe,age,ageMoe,income,incomeMoe,healthcare,healthcareLow,healthcareHigh,obesity,obesityLow,obesityHigh,smokes,smokesLow,smokesHigh,-0.385218228
// Import Data
d3.csv("assets/data/data.csv").then(function(censusData, err) {
    if (err) throw err;
    
    // Parse my data and cast as numbers
    censusData.forEach(function(data) {
      data.income = +data.income;
      data.age = +data.age;
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
      data.smokes = +data.smokes;
      data.obesity = +data.obesity;
    });

    // Create scale functions
    var xLinearScale1 = xScale(censusData, chosenXAxis);
    var yLinearScale1 = yScale(censusData, chosenYAxis);
    
    // Create axes functions
    var bottomAxis = d3.axisBottom(xLinearScale1);
    var leftAxis = d3.axisLeft(yLinearScale1);

    var xAxis = chartGroup1.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height1})`)
        .call(bottomAxis);

    chartGroup1.append("g")
      .call(leftAxis);

    var circlesGroup1 = chartGroup1.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale1(d[chosenXAxis]))
        .attr("cy", d => yLinearScale1(d[chosenYAxis]))
        .attr("r", "12")
        .attr("fill", "#65a9c9")
        .attr("opacity", ".65");

    var labelsGroupX = chartGroup1.append("g")
        .attr("transform", `translate(${width1 / 2}, ${height1 + margin.top + 10})`);
    
    var labelsGroupY = chartGroup1.append("g")
        .attr("transform", "rotate(-90)");
    
    // X labels
    var incomeLabel = labelsGroupX.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "income") // value to grab for event listener
        .classed("active", true)
        .text("Household Income (Median)");

    var ageLabel = labelsGroupX.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age") // value to grab for event listener
        .classed("active", true)
        .text("Age (Median)");
    
    var povertyLabel = labelsGroupX.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "poverty") // value to grab for event listener
        .classed("active", true)
        .text("In Poverty (%)");
    
    // Y labels
    var healthcareLabel = labelsGroupY.append("text")
      .attr("y", 0 - margin1.left + 5)
      .attr("x", 0 - (height1 / 2))
      .attr("dy", "1em")
      .attr("text-anchor", "middle")
      .attr("class", "axisText")
      .attr("value", "healthcare")
      .text("Lacks Healthcare (%)");
    
    var smokesLabel = labelsGroupY.append("text")
      .attr("y", 0 - margin1.left + 25)
      .attr("x", 0 - (height1 / 2))
      .attr("dy", "1em")
      .attr("text-anchor", "middle")
      .attr("class", "axisText")
      .attr("value", "smokes")
      .text("Smokes (%)");

    var obeseLabel = labelsGroupY.append("text")
      .attr("y", 0 - margin1.left + 45)
      .attr("x", 0 - (height1 / 2))
      .attr("dy", "1em")
      .attr("text-anchor", "middle")
      .attr("class", "axisText")
      .attr("value", "obese")
      .text("Obese (%)");

    var circlesGroup1 = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup1)  
    
    // x axis labels event listener
    labelsGroupX.selectAll("text").on("click", function() {
    
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {

            // replaces chosenXAxis with value
            chosenXAxis = value;

            console.log(chosenXAxis);
            
            // functions here found above csv import
            // updates x scale for new data
            xLinearScale1 = xScale(censusData, chosenXAxis);

            // updates x axis with transition
            xAxis = renderAxes(xLinearScale1, xAxis);

            // updates circles with new x values
            circlesGroup1 = renderCircles(circlesGroup1, xLinearScale1, chosenXAxis);

            // updates tooltips with new info
            circlesGroup1 = updateToolTip(chosenXAxis, circlesGroup1);

            // changes classes to change bold text
            if (chosenXAxis === "poverty") {
                incomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
                ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                povertyLabel
                    .classed("active", true)
                    .classed("inactive", false);
            }
            else if (chosenXAxis === "age") {
                incomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
                ageLabel
                    .classed("active", true)
                    .classed("inactive", false);
                povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else {
                incomeLabel
                    .classed("active", true)
                    .classed("inactive", false);
                ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            // // Label circles 
            // chartGroup.selectAll("null").data(censusData).enter().append("text")
            //     .attr("x", d => xLinearScale(d[value]))
            //     .attr("y", d => yLinearScale(d[value] + 5))
            //     .text(d => d.abbr)
            //     .attr("font-family", "sans-serif")
            //     .attr("font-size", "12px")
            //     .attr("font-weight", "bold")
            //     .attr("text-anchor", "middle")
            //     .attr("fill", "black");
        }
    });

    labelsGroupY.selectAll("text").on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {
            // replaces chosenXAxis with value
            chosenYAxis = value;
  
            console.log(chosenYAxis);
  
            // functions here found above csv import
            // updates x scale for new data
            yLinearScale1 = yScale(censusData, chosenYAxis);
  
            // updates x axis with transition
            yAxis = renderYAxes(yLinearScale1, yAxis);
  
            // updates circles with new x values
            circlesGroup1 = renderCircles(circlesGroup1, yLinearScale1, chosenYAxis);
  
            // updates tooltips with new info
            circlesGroup1 = updateToolTip(chosenYAxis, circlesGroup1);
  
            // changes classes to change bold text
            if (chosenYAxis === "obese") {
                smokesLabel
                    .classed("active", false)
                    .classed("inactive", true);
                ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                obeseLabel
                    .classed("active", true)
                    .classed("inactive", false);
            }
            else if (chosenXAxis === "healthcare") {
                smokesLabel
                    .classed("active", false)
                    .classed("inactive", true);
            healthcareLabel
                    .classed("active", true)
                    .classed("inactive", false);
            obeseLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
            else {
                smokesLabel
                    .classed("active", true)
                    .classed("inactive", false);
                healthcareLabel
                    .classed("active", false)
                    .classed("inactive", true);
                obeseLabel
                    .classed("active", false)
                    .classed("inactive", true);
            }
        }
    });
  }).catch(function(error) {
    console.log(error);
});

