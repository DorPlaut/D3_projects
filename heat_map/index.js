// fetch data
const url =
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';

const getData = async () => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    const { baseTemperature, monthlyVariance } = data;
    chart(baseTemperature, monthlyVariance);
  } catch (error) {
    console.error('Error:', error);
  }
};

getData();

// SET CHART
// chart vars
const chart = (baseTemp, dataSet) => {
  // size
  const w = 1200;
  const h = 500;
  const padding = 90;
  const paddingLeft = padding / 2;
  // phrase data
  const timeParse = d3.timeFormat('%B');

  // SET SCALE
  // color scale
  const maxTemp = d3.max(dataSet, (d) => d.variance);
  const minTemp = d3.min(dataSet, (d) => d.variance);
  const tempScale = d3
    .scaleSequential(d3.interpolateInferno)
    .domain([minTemp, maxTemp]);
  // x scale
  const years = dataSet.map((i) => i.year);
  const ScaleX = d3
    .scaleTime()
    .domain([d3.min(years) - 1, d3.max(years) + 1])
    .range([padding, w - paddingLeft]);
  // y scale
  const ScaleY = d3
    .scaleBand()
    .domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
    .range([padding, h - paddingLeft]);
  // SET AXIS
  // x axis
  const axisX = d3
    .axisBottom(ScaleX)
    .tickFormat(d3.format('d'))
    .tickSizeOuter(0);
  // y axis
  const axisY = d3
    .axisLeft(ScaleY)
    .tickFormat((d) => {
      const month = timeParse(new Date(1999 + '-' + d));
      return month;
    })
    .tickSizeOuter(0);

  // SVG
  // append
  const svg = d3
    .select('.chart')
    .append('svg')
    .attr('width', w)
    .attr('height', h);
  // add rect
  svg
    .selectAll('.cell')
    .data(dataSet)
    .enter()
    .append('rect')
    .attr('data-month', (d) => d.month - 1)
    .attr('data-year', (d) => d.year)
    .attr('data-temp', (d) => d.variance + baseTemp)
    .attr('class', 'cell')
    .attr('x', (d, i) => ScaleX(d.year) - padding / 12 / 2)
    .attr('y', (d, i) => ScaleY(d.month))
    .attr('width', (w - padding * 2) / (dataSet.length / 12) + 1)
    .attr('height', (h - paddingLeft) / 12 - paddingLeft / 12)
    .style('fill', (d, i) => {
      return tempScale(d.variance + 2);
    })
    // handle hover - tag
    .on('mouseover', (e, i) => {
      tag.classList.add('visible');
      tag.setAttribute('data-year', i.year);
      tag.innerHTML = ` <h4>${i.year} - ${timeParse(
        new Date(1999 + '-' + i.month)
      )}</h4><h5>${(i.variance + baseTemp).toFixed(1)}℃ </h5>
      <h5>${i.variance.toFixed(1)}℃ </h5>`;
    })
    .on('mouseleave', (d, i) => {
      tag.classList.remove('visible');
    });
  // tag placemant
  const tag = document.querySelector('.tag');
  document.addEventListener('mousemove', (d) => {
    tag.style.transform = 'translateY(' + (d.clientY - 0) + 'px)';
    tag.style.transform += 'translateX(' + (d.clientX - 0) + 'px)';
  });

  //  append axis rullers
  svg
    .append('g')
    .attr('transform', 'translate(0,' + (h - paddingLeft + 4) + ')')
    .attr('id', 'x-axis')
    .call(axisX);
  svg
    .append('g')
    .attr('transform', 'translate(' + padding + ',0 )')
    .attr('id', 'y-axis')
    .call(axisY);

  // LEGEND
  // data
  const legendData = [
    { color: 2.8 },
    { color: 3.9 },
    { color: 5.0 },
    { color: 6.1 },
    { color: 7.2 },
    { color: 8.3 },
    { color: 9.5 },
    { color: 10.6 },
    { color: 11.7 },
    { color: 12.8 },
  ];
  // append legend
  const legend = svg.append('g').attr('id', 'legend');
  legendWidht = h / 16;
  legendHeight = h / 16;
  // legend sacle
  const legendSacle = d3
    .scaleBand()
    .domain(legendData.map((i) => i.color))
    .range([
      w / 2 - (legendWidht * legendData.length) / 2,
      w / 2 -
        (legendWidht * legendData.length) / 2 +
        legendWidht * legendData.length,
    ]);
  // legend axis
  const legendAxis = d3.axisBottom(legendSacle).tickSizeOuter(0);
  // append ruler
  svg
    .append('g')
    .attr('transform', `translate( 0 ,${padding / 2 + legendHeight / 2} )`)
    .call(legendAxis);
  // append rect
  legend
    .selectAll('.legendRect')
    .data(legendData)
    .enter()
    .append('rect')
    .attr('x', (d, i) => {
      return w / 2 - (legendWidht * legendData.length) / 2 + i * legendWidht;
    })
    .attr('y', padding / 2 - legendHeight / 2)
    .attr('height', legendHeight)
    .attr('width', legendWidht)
    .style('fill', (d, i) => {
      return tempScale(d.color - 7);
    });
};
