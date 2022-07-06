async function draw(el, scale) {
  // Data
  const data = await d3.json("educative-us-household-income-data-heatmap.json");
  data.sort((a, b) => a - b);

  // Dimensions
  let dimensions = {
    width: 600,
    height: 150,
  };

  const row = 5,
    col = data.length / row,
    box = width / col;

  // Draw Image
  const svg = d3
    .select(el)
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  // Scales
  let colorScale;

  if (scale === "linear") {
    colorScale = d3
      .scaleLinear()
      .domain(d3.extent(data))
      .range(["white", "red"]);
  } else if (scale === "quantize") {
    colorScale = d3
      .scaleQuantize()
      .domain(d3.extent(data))
      .range(["white", "pink", "red"]);

    console.log("Quantize:", colorScale.thresholds());
  } else if (scale === "quantile") {
    colorScale = d3
      .scaleQuantile()
      .domain(data)
      .range(["white", "pink", "red"]);

    console.log("Quantile:", colorScale.quantiles());
  } else if (scale === "threshold") {
    colorScale = d3
      .scaleThreshold()
      .domain([45200, 135600])
      .range(d3.schemeReds[3]);
  }

  // Rectangles
  svg
    .append("g")
    .attr("transform", "translate(2,2)")
    .attr("stroke", "black")
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("width", box - 3)
    .attr("height", box - 3)
    .attr("x", (d, i) => box * (i % 20))
    .attr("y", (d, i) => box * ((i / 20) | 0))
    .attr("fill", colorScale);
}

draw("#heatmap1", "linear");
draw("#heatmap2", "quantize");
draw("#heatmap3", "quantile");
draw("#heatmap4", "threshold");
