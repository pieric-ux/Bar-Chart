const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json';

d3.json(url)
  .then(data => {

    const container = d3
      .select('.main')
      .append('div')
      .attr('class', 'container');
    
    container
      .append('h1')
      .attr('id', 'title')
      .text('United States GDP');

    const visHolder = container
      .append('div')
      .attr('class', 'visHolder');
    
    const width = Math.ceil(data.data.length / 4) * 11;
    const height = 400;
    const padding = {
      top: 25,
      right: 50,
      bottom: 25,
      left: 50
    };
    const barWidth = width / data.data.length;

    const xScale = d3.scaleTime()
      .domain([
        d3.min(data.data, d => new Date(d[0])),
        d3.max(data.data, d => new Date(d[0]))
      ])
      .range([0, width]);
    
    const yScale = d3.scaleLinear()
      .domain([
        0, 
        d3.max(data.data, (d) => d[1])
      ])
      .range([height, 0]);

    const xAxis = d3.axisBottom(xScale);

    const yAxis = d3.axisLeft(yScale);

    const svg = visHolder
      .append('svg')
      .attr('width', padding.left + width + padding.right)
      .attr('height', padding.top + height + padding.bottom);
    
    svg
      .append('g')
      .attr('id', 'x-axis')
      .attr('class', 'x-axis')
      .attr('transform', 'translate(' + padding.left + ',' + (height + padding.top) + ')')
      .call(xAxis);

    svg
      .append('g')
      .attr('id', 'y-axis')
      .attr('class', 'y-axis')
      .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')')
      .call(yAxis);

    const tooltip = d3
    .select('body')
    .append('div')
    .attr('class', 'tooltip')
    .attr('id', 'tooltip');

    svg
      .append('g')
      .selectAll('rect')
      .data(data.data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('data-date', (d) => d[0])
      .attr('data-gdp', (d) => d[1])
      .attr('x', (d) => xScale(new Date(d[0])) + padding.left)
      .attr('y', (d) => yScale(d[1]) + padding.top)
      .attr('width', barWidth)
      .attr('height', (d) => height - yScale(d[1]))
      .attr('fill', 'steelblue')
      .on('mouseover', (event, d) => {
        const date = new Date(d[0]);
        const quarter = Math.floor((date.getMonth() + 3) / 3);
        
        const content = d3.utcFormat('%Y')(date) + ' Q' + quarter + "<br>$" + d[1] + " Billion";
        
        const xTooltip = xScale(new Date(d[0]));
        const yTooltip = yScale(d[1]);
       
        const containerOffsetLeft = container.node().offsetLeft;
        const containerOffsetTop = container.node().offsetTop;

        tooltip
          .html(content)
          .attr('data-date', d[0])
          .style('opacity', 0.9)
          .style('left', xTooltip + containerOffsetLeft + 'px')
          .style('top', yTooltip + containerOffsetTop + 'px');
      })
      .on('mouseout', (event, d) => {
        tooltip
          .style('opacity', 0);
      });
      
  })
  .catch((err) => console.error(err));
