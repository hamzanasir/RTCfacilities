/*global $ Meny d3 */

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

  const mobile = $(window).width() <= 500;
  renderSVG(mobile, $('#floor').select2('data')[0].text, true);

  $('#floor').on('select2:select', function (e) {
      var data = e.params.data;
      renderSVG(mobile, data.text, false);
  });
});

function renderSVG (mobile, svgName, initialRender) {
  const svgPath = !mobile ? `/svg/${svgName}-R.svg` : `/svg/${svgName}.svg`;

  d3.xml(svgPath, function(xml) {
    try {
      $('#svgContainer').empty();
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
      
      svg.selectAll('path').each(function (d, i) {
        let room = d3.select(this).attr('id').split('-')[1];
        $.get(`/stuart/${room}`).then((room) => {
          let higherCount = 0;
          room.complaints.forEach((complaint) => {
            if (complaint.higher) {
              console.log(`Adding for`);
              console.log(room)
              higherCount += 1;
            } else {
              console.log(`Subtracting for`);
              console.log(room);
              higherCount -= 1;
            }
          });
          console.log(higherCount);
          if (higherCount > 0) {
            d3.select(this).style('fill', 'blue');
          } else if (higherCount < 0) {
            d3.select(this).style('fill', 'red');
          } else {
            d3.select(this).style('fill', 'none');
          }
        });
      });
      $('path').click(function(e) {
        $('#submitReport form').attr('action', `/stuart/${e.target.id.split('-')[1]}`);
        $('#submitReport').modal({show: true})
      });
      if (!initialRender) {
        $('.alert').remove();
      }
    } catch (e) {
      $('.alert').remove();
      $('nav').after(`<div class="alert alert-danger container" style="margin-top: 25px;" role="alert">
        Sorry the map for this floor doesn't exist.
      </div>`);
    }
  });
}
