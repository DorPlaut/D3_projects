// fetch data
const url =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json';

const getData = async () => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    // dataSet = data.children;
    chart(data);
  } catch (error) {
    console.error('Error:', error);
  }
};

getData();

// SET CHART
// chart vars
const chart = (dataSet) => {
  // size
  const w = 1300;
  const h = 800;
  const legendHeight = h / 15;
  const padding = 1;
  // tree map
  const treemap = d3
    .treemap()
    .size([w, h - legendHeight])
    .padding(padding)
    .round(true);
  const root = d3.hierarchy(dataSet).sum((d) => d.value);
  const tree = treemap(root);
  const consoles = dataSet.children.map((item) => item.name);
  const color = d3.scaleOrdinal(d3.schemePaired);

  // SVG
  const svg = d3
    .select('.chart')
    .append('svg')
    .attr('width', w)
    .attr('height', h);

  // tiles

  const container = svg
    .selectAll('.tile')
    .data(tree.leaves())
    .enter()
    .append('g')
    .attr('class', 'tile-container')
    .attr('transform', (d) => {
      return `translate(${d.x0},${d.y0} )`;
    });

  container
    .append('rect')
    .attr('class', 'tile')
    .attr('height', (d) => d.y1 - d.y0)
    .attr('width', (d) => d.x1 - d.x0)
    .style('fill', (d) => color(d.data.category))
    .attr('data-name', (d) => d.data.name)
    .attr('data-category', (d) => d.data.category)
    .attr('data-value', (d) => d.data.value)
    // hover
    .on('mouseenter', (e, d) => {
      const { name, category, value } = d.data;
      tag.setAttribute('data-value', value);
      tag.classList.add('visible');
      tag.innerHTML = ` <p>Name: ${name} </p> <p>Category: ${category} </p> <p>Value: ${value} </p>`;
    })
    .on('mouseleave', (d, i) => {
      tag.classList.remove('visible');
    });

  // handle tag placemant
  const tag = document.querySelector('.tag');
  document.addEventListener('mousemove', (d) => {
    tag.style.transform = 'translateY(' + (d.clientY - 0) + 'px)';
    tag.style.transform += 'translateX(' + (d.clientX - 0) + 'px)';
  });

  container
    .append('foreignObject')
    .text((d) => d.data.name)
    .attr('class', 'label')
    .attr('height', (d) => d.y1 - d.y0)
    .attr('width', (d) => d.x1 - d.x0);

  // legend

  console.log(consoles);

  const legend = svg
    .append('g')
    .attr('id', 'legend')
    .selectAll('.legend-key')
    .data(consoles)
    .enter()
    .append('g')
    .attr('class', 'legend-key')
    .attr('transform', `translate(0,${h - legendHeight + padding})`);

  legend
    .append('rect')
    .attr('class', 'legend-item')
    .attr('x', (d, i) => i * (w / consoles.length))
    .attr('width', w / consoles.length)
    .attr('height', legendHeight)
    .style('fill', (d) => color(d));

  legend
    .append('foreignObject')
    .text((d) => d)
    .attr('class', 'keys-text')
    .attr('x', (d, i) => i * (w / consoles.length))
    .attr('width', w / consoles.length)
    .attr('height', legendHeight)
    .attr('transform', `translate(0,${legendHeight / 4})`);
};
