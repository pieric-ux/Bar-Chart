const projectName = 'bar-chart';

let width = 800,
  height = 400,
  barWidth = width / 275;

let tooltip = d3
  .select('.visHolder')
  .append('div')
  .attr('id', 'tooltip')
  .style('opacity', 0);

let overlay = d3
  .select('.visHolder')
  .append('div')
  .attr('class', 'overlay')
  .style('opacity', 0);

let svgContainer = d3
  .select('.visHolder')
  .append('svg')
  .attr('width', width + 100)
  .attr('height', height + 60);

d3.json(
  'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json'
)
  .then(data => {
    svgContainer
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -275)
      .attr('y', 100)
      .text('Gross Domestic Product');

    svgContainer
      .append('text')
      .attr('x', width / 2 + 120)
      .attr('y', height + 50)
      .text('More Information: http://www.bea.gov/national/pdf/nipaguid.pdf')
      .attr('class', 'info');

    let years = data.data.map(function (item) {
      let quarter;
      let month = item[0].substring(5, 7);

      if (month === '01') {
        quarter = 'Q1';
      } else if (month === '04') {
        quarter = 'Q2';
      } else if (month === '07') {
        quarter = 'Q3';
      } else if (month === '10') {
        quarter = 'Q4';
      }

      return item[0].substring(0, 4) + ' ' + quarter;
    });

    let yearsDate = data.data.map(function (item) {
      return new Date(item[0]);
    });

    let xMin = new Date(d3.min(yearsDate));
    let xMax = new Date(d3.max(yearsDate));
    xMax.setMonth(xMax.getMonth() + 3);
    let xScale = d3
      .scaleTime()
      .domain([xMin, xMax])
      .range([0, width]);

    let xAxis = d3.axisBottom().scale(xScale);

    svgContainer
      .append('g')
      .call(xAxis)
      .attr('id', 'x-axis')
      .attr('transform', 'translate(60, 400)');

    let GDP = data.data.map(function (item) {
      return item[1];
    });

    let scaledGDP = [];

    let gdpMax = d3.max(GDP);

    let linearScale = d3.scaleLinear().domain([0, gdpMax]).range([0, height]);

    scaledGDP = GDP.map(function (item) {
      return linearScale(item);
    });

    let yAxisScale = d3.scaleLinear().domain([0, gdpMax]).range([height, 0]);

    let yAxis = d3.axisLeft(yAxisScale);

    svgContainer
      .append('g')
      .call(yAxis)
      .attr('id', 'y-axis')
      .attr('transform', 'translate(60, 0)');

    d3.select('svg')
      .selectAll('rect')
      .data(scaledGDP)
      .enter()
      .append('rect')
      .attr('data-date', function (d, i) {
        return data.data[i][0];
      })
      .attr('data-gdp', function (d, i) {
        return data.data[i][1];
      })
      .attr('class', 'bar')
      .attr('x', function (d, i) {
        return xScale(yearsDate[i]);
      })
      .attr('y', function (d) {
        return height - d;
      })
      .attr('width', barWidth)
      .attr('height', (d) => d)
      .attr('index', (d, i) => i)
      .style('fill', '#33adff')
      .attr('transform', 'translate(60, 0)')
      .on('mouseover', function (event, d) {
        // d or datum is the height of the
        // current rect
        let i = this.getAttribute('index');

        overlay
          .transition()
          .duration(0)
          .style('height', d)
          .style('width', barWidth)
          .style('opacity', 0.9)
          .style('left', i * barWidth + 0)
          .style('top', height - d)
          .style('transform', 'translateX(60px)');
        
        tooltip.transition().duration(200).style('opacity', 0.9);
        
        tooltip
          .html(
            years[i] +
              '<br>' +
              '$' +
              GDP[i].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') +
              ' Billion'
          )
          .attr('data-date', data.data[i][0])
          .style('left', i * barWidth + 30 + 'px')
          .style('top', height - 100 + 'px')
          .style('transform', 'translateX(60px)');
      })
      .on('mouseout', function () {
        tooltip.transition().duration(200).style('opacity', 0);
        overlay.transition().duration(200).style('opacity', 0);
      });
  })
  .catch(e => console.log(e));
