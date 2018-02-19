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
  const svgPath = viewportWidth > 500 ? '/assets/SB-01-R.svg' : '/assets/SB-01.svg';

  d3.xml(svgPath, function(xml) {
    $('#svgContainer').append(xml.documentElement);
    const svg = d3.select('svg');
    svg.attr('width', '100%');
    svg.attr('height', '100%');
  });
});
