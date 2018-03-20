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
  
  $('.sw').change(function () {
    if ($(this).is(':checked')) {
      renderMockBeacons();
    } else {
      d3.selectAll('circle').remove();
    }
  });

  $('#floor').on('select2:select', function (e) {
      var data = e.params.data;
      renderSVG(mobile, data.text, false);
  });
  
  $.get('https://crossorigin.me/https://api.darksky.net/forecast/4152be98ca71e28f0d675829b06509f9/41.838543,-87.627276?units=si').then((weather) => {
    $('#outsideTemperature').text(`${weather.currently.temperature} °C`);
    $('#outsideHumidity').text(`${weather.currently.humidity * 100}%`);
  });
});

function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function returnRGBColor(temp) {
  let max = 50;
  let avg = temp/max;
  let red = Math.round(avg*255);
  let green = avg >= 0.5 ? 1 : 0;
  let blue = Math.round((1 - avg) * 255);
  return `rgb(${red}, ${green}, ${blue})`;
}

function renderMockBeacons() {
  const viewBox = d3.select('svg').attr('viewBox').split(" ");
  const width = parseInt(viewBox[2], 10) - 200;
  const height = parseInt(viewBox[3], 10) - 200;
  let i;
  for (i = 0; i < 10; i++) { 
    renderBeacon(getRandomNumber(200, width), getRandomNumber(100, height), Math.floor(getRandomNumber(0, 50)));
  }
}

function renderBeacon (x, y, temp) {
  d3.select('svg').append('circle')
                  .attr("cx", x)
                  .attr("cy", y)
                  .attr("r", 15);
  
  d3.select('svg').append('circle')
                  .attr("cx", x)
                  .attr("cy", y)
                  .attr("r", 0)
                  .attr("data-toggle", "tooltip")
                  .attr("title", `Temperature: ${temp}°C`)
                  .on('mouseover', function() {
                    d3.select(this).transition()
                                   .duration(300)
                                   .attr("r", "100");
                    $(this).tooltip();
                    $(this).tooltip('show');
                  })
                  .on('mouseout', function () {
                    d3.select(this).transition()
                                   .duration(300)
                                   .attr("r", "50");
                  })
                  .style("fill", returnRGBColor(temp))
                  .style("fill-opacity", "0.6")
                  .style("stroke", "black")
                  .style("stroke-dasharray", "80, 50")
                  .style("stroke-width", "8")
                  .transition()
                  .duration(300)
                  .attr("r", 50)
                  .attr("transform", "rotate(180deg)");
  }

function renderSVG (mobile, svgName, initialRender) {
  const svgPath = !mobile ? `/svg/${svgName}-R.svg` : `/svg/${svgName}.svg`;

  d3.xml(svgPath, function(xml) {
    $('[data-toggle="tooltip"]').tooltip('hide');
    try {
      $('#svgContainer').empty();
      $('#svgContainer').append(xml.documentElement);
      const svg = d3.select('svg');
      svg.attr('width', '100%');
      svg.attr('height', !mobile ? '87vh' : '100%');
      
      svg.selectAll('path').each(function (d, i) {
        let room = d3.select(this).attr('id');
        $.get(`/stuart/${room.split('-')[1]}`).then((room) => {
          let higherCount = 0;
          let hcount = 0;
          let lcount = 0;
          room.complaints.forEach((complaint) => {
            if (complaint.higher) {
              higherCount += 1;
              hcount += 1;
            } else {
              higherCount -= 1;
              lcount += 1;
            }
          });
          d3.select(this).attr('data-toggle', 'tooltip');
          d3.select(this).attr('data-html', 'true');
          d3.select(this).attr('title', `${room.roomNumber}: <span class="badge badge-pill badge-danger"><i class="fas fa-arrow-alt-circle-up"></i></span> ${hcount} <span class="badge badge-pill badge-primary"><i class="fas fa-arrow-alt-circle-down"></i></span> ${lcount}`);
          $(this).tooltip();
          if (higherCount > 0) {
            d3.select(this).style("fill-opacity", "0")
                           .style('fill', 'blue')
                           .transition()
                           .duration(300)
                           .style("fill-opacity", "0.59");
          } else if (higherCount < 0) {
            d3.select(this).style("fill-opacity", "0")
                           .style('fill', 'red')
                           .transition()
                           .duration(300)
                           .style("fill-opacity", "0.59");
          } else {
            d3.select(this).style('fill', 'none');
          }
        });
      });
      $('path').click(function(e) {
        $('[data-toggle="tooltip"]').tooltip('hide');
        $('#submitReport form').attr('action', `/stuart/${e.target.id.split('-')[1]}`);
        $('#submitReport').modal({show: true});
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
