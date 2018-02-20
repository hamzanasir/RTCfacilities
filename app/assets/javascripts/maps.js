$(document).ready(function() {
  $('#floor').select2();
  $('#mySelect2').on('select2:select', function (e) {
      var data = e.params.data;
      console.log(data);
  });

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

  const mobile = $(window).width() <= 500;
  renderSVG(mobile, $('#floor').select2('data')[0].text);
});

function renderSVG (mobile, svgName) {
  const svgPath = !mobile ? `/svg/${svgName}-R.svg` : `/svg/${svgName}.svg`;

  d3.xml(svgPath, function(xml) {
    $('#svgContainer').append(xml.documentElement);
    const svg = d3.select('svg');
    svg.attr('width', '100%');
    svg.attr('height', !mobile ? '87vh' : '100%');

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
