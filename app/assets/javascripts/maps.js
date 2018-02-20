$(document).ready(function() {
  $('#floor').select2();

  var meny = Meny.create({
  	menuElement: document.querySelector( '.meny' ),
  	contentsElement: document.querySelector( '.contents' ),
  	position: 'left',
  	height: 100,
  	width: 260,
  	angle: 30,
  	threshold: 40,
  	overlap: 6,
  	transitionDuration: '0.5s',
  	transitionEasing: 'ease',
  	gradient: 'rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.65) 100%)',
  	mouse: true,
  	touch: true,
  });

  const viewportWidth = $(window).width();
  const svgPath = viewportWidth > 500 ? '/svg/SB-01-R.svg' : '/svg/SB-01.svg';
  if (viewportWidth > 500) {   //desktop rendering
    d3.xml(svgPath, function(xml) {
      $('#svgContainer').append(xml.documentElement);
      const svg = d3.select('svg');
      svg.attr('width', '100%');
      svg.attr('height', '87vh');

      svg.selectAll('path').on('mouseover', function() {
        d3.select(this).style("fill-opacity", "0")
                       .style('fill', '#51047a')
                       .transition()
                       .duration(300)
                       .style("fill-opacity", "0.59");
      }).on('mouseout', function () {
        d3.select(this).transition()
                       .duration(300)
                       .style("fill-opacity", "0");
      });
    });
  } else {  //mobile rendering
    d3.xml(svgPath, function(xml) {
      $('#svgContainer').append(xml.documentElement);
      const svg = d3.select('svg');
      svg.attr('width', '100%');
      svg.attr('height', '100%');

      svg.selectAll('path').on('mouseover', function() {
        d3.select(this).style("fill-opacity", "0")
                       .style('fill', '#51047a')
                       .transition()
                       .duration(300)
                       .style("fill-opacity", "0.59");
      }).on('mouseout', function () {
        d3.select(this).transition()
                       .duration(300)
                       .style("fill-opacity", "0");
      });
    });
  }
});
