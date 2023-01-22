// fetch data
const url =
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

const getData = async () => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    const dataSet = data.data;
    chart(dataSet);
  } catch (error) {
    console.error('Error:', error);
  }
};

getData();

// SET CHART
// create chart
const chart = (dataSet) => {
  const w = 900;
  const h = 500;
  const padding = 50;

  // set scale
  // x
  const xScale = d3
    .scaleTime()
    .domain([new Date(d3.min(dataSet)[0]), new Date(d3.max(dataSet)[0])])
    .range([padding, w - padding]);
  // y
  const yScale = d3
    .scaleLinear()
    .domain([d3.max(dataSet.map((i) => i[1])), 0])
    .range([padding, h - padding]);
  // set axis
  const axisX = d3.axisBottom(xScale);
  const axisY = d3.axisLeft(yScale);

  // select the chart
  const svg = d3
    .select('.chart')
    .append('svg')
    .attr('width', w)
    .attr('height', h);
  // add bars
  svg
    .selectAll('rect')
    .data(dataSet)
    .enter()
    .append('rect')
    .attr('data-date', (i) => i[0])
    .attr('data-gdp', (i) => i[1])
    .attr('x', (d, i) => {
      return (
        i * (w / dataSet.length - (padding * 2) / dataSet.length) + padding
      );
    })
    .attr('y', (d, i) => yScale(d[1]))
    .attr('width', (d) => w / dataSet.length - 1)
    .attr('height', (d, i) => h - yScale(d[1]) - padding)
    .attr('class', 'bar');

  // handle hover event
  const bars = document.querySelectorAll('.bar');
  const tag = document.querySelector('.tag');
  bars.forEach((i) => {
    i.addEventListener('mouseenter', () => {
      let amount = '$' + i.__data__[1] + ' Bilion';
      let year = i.__data__[0].slice(0, 4);
      tag.classList.add('visible');
      tag.innerHTML = ` <h3>${year}</h3> <h4>${amount}</h4>`;
      tag.setAttribute('data-date', i.__data__[0]);
      console.log(tag.getAttribute('data-date'));
    });
    i.addEventListener('mouseleave', () => {
      tag.classList.remove('visible');
    });
  });

  document.addEventListener('mousemove', (d) => {
    tag.style.transform = 'translateY(' + (d.clientY - 80) + 'px)';
    tag.style.transform += 'translateX(' + (d.clientX - 100) + 'px)';
  });

  //  append axis rollers
  svg
    .append('g')
    .attr('transform', 'translate(0,' + (h - padding) + ')')
    .attr('id', 'x-axis')
    .call(axisX);

  svg
    .append('g')
    .attr('transform', 'translate(' + padding + ',0 )')
    .attr('id', 'y-axis')

    .call(axisY);
};
