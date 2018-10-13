/*global $ Meny d3 */

$(document).ready(function() {
  $('#floor').select2();
  $('#room').select2({width: '100%'});
  customStyles();

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

  $('#mockBeacons').change(function () {
    if ($(this).is(':checked')) {
      renderMockBeacons();
    } else {
      d3.selectAll('circle').remove();
    }
  });
  
  $('#showBeacons').change(function () {
    if ($(this).is(':checked')) {
      renderRealBeacons(mobile);
    } else {
      d3.selectAll('circle').remove();
    }
  });

  $('#floor').on('select2:select', function (e) {
    var data = e.params.data;
    renderSVG(mobile, data.text, false);
  });
  
  $('#room').on('select2:select', function (e) {
    const currentPath = window.location.pathname;
    const data = e.params.data;
    $('#modalRoom').text(`${currentPath.charAt(1).toUpperCase() + currentPath.slice(2)} Room ${data.id.split('-')[1]}`);
    $('#submitReport form').attr('action', `${currentPath}/${data.id.split('-')[1]}`);
    $('#submitReport').modal({show: true});
  });

  $.get('https://crossorigin.me/https://api.darksky.net/forecast/4152be98ca71e28f0d675829b06509f9/41.838543,-87.627276?units=si').then((weather) => {
    $('#outsideTemperature').text(`${parseInt(weather.currently.temperature, 10)} °C`);
    $('#outsideHumidity').text(`${parseInt(weather.currently.humidity * 100, 10)}%`);
  });
});

// Should figure out a way to do this in css
function customStyles() {
  // Custom styles for stuart maps
  if (window.location.pathname === '/stuart') {
    $('body').height('100vh');
  }
}

function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function returnRGBColor(temp) {
  if (!temp) {
    return 'rgb(159, 161, 165)';
  }
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

function renderRealBeacons(mobile) {
  const building = $('#floor').select2('data')[0].text.split('-')[0];
  const floor = $('#floor').select2('data')[0].text.split('-')[1];
  // Database correlation for building_id's and Building's. Should do this via API
  $.get(`https://api.iitrtclab.com/beacons/${building}/${floor}`).then((beacons) => {
    console.log(beacons);
    beacons.forEach(function(beacon) {
      setBeacon(beacon.x, beacon.y, mobile, beacon)
    });
  });
}

function renderBeacon (x, y, beacon) {
  d3.select('svg').append('circle')
                  .attr("cx", x)
                  .attr("cy", y)
                  .attr("r", 15);

  d3.select('svg').append('circle')
                  .attr("cx", x)
                  .attr("cy", y)
                  .attr("r", 0)
                  .attr("data-toggle", "tooltip")
                  .attr("title", `Temperature: ${beacon.temperature}°C \nHumidity: ${beacon.humidity}%\nLast Updated: ${moment(beacon.updatetimestamp).format('MMMM Do YYYY, h:mm:ss a')}`)
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
                  .style("fill", returnRGBColor(beacon.temperature))
                  .style("fill-opacity", "0.6")
                  .style("stroke", "black")
                  .style("stroke-dasharray", "80, 50")
                  .style("stroke-width", "8")
                  .transition()
                  .duration(300)
                  .attr("r", 50)
                  .attr("transform", "rotate(180deg)");
}

function renderIdeaShopBeacon (x, y, beacon) {
    d3.select('svg').append('circle')
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 1);

    d3.select('svg').append('circle')
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 0)
        .attr("data-toggle", "tooltip")
        .attr("title", `Temperature: ${beacon.temperature}°C \nHumidity: ${beacon.humidity}%\nLast Updated: ${moment(beacon.updatetimestamp).format('MMMM Do YYYY, h:mm:ss a')}`)
        .on('mouseover', function() {
            d3.select(this).transition()
                .duration(300)
                .attr("r", "9");
            $(this).tooltip();
            $(this).tooltip('show');
        })
        .on('mouseout', function () {
            d3.select(this).transition()
                .duration(300)
                .attr("r", "4.5");
        })
        .style("fill", returnRGBColor(beacon.temperature))
        .style("fill-opacity", "0.6")
        .style("stroke", "black")
        .style("stroke-dasharray", "9, 3")
        .style("stroke-width", "0.75")
        .transition()
        .duration(300)
        .attr("r", 4.5)
        .attr("transform", "rotate(180deg)");
}

function renderSVG (mobile, svgName, initialRender) {
  const currentPath = window.location.pathname;
  const svgPath = !mobile ? `/svg/${svgName}-R.svg` : `/svg/${svgName}.svg`;

  d3.xml(svgPath, function(xml) {
    $('[data-toggle="tooltip"]').tooltip('hide');
    try {
      $('.svgContainer').empty();
      $('.svgContainer').append(xml.documentElement);
      const svg = d3.select('svg');
      svg.attr('width', '100%');
      svg.attr('height', !mobile ? '87vh' : '100%');

      $('#showBeacons').prop('checked', true);
      renderRealBeacons(mobile);

      svg.selectAll('path').each(function (d, i) {
        let room = d3.select(this).attr('id');
        $.get(`${currentPath}/${room.split('-')[1]}`).then((room) => {
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
        const room = e.target.id.split('-')[1]
        $('#modalRoom').text(`${currentPath.charAt(1).toUpperCase() + currentPath.slice(2)} Room ${room}`);
        $('[data-toggle="tooltip"]').tooltip('hide');
        $('#submitReport form').attr('action', `${currentPath}/${room}`);
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

// Functions for mapping real life becons on Map
function setLocation(x, y, radius) {
    d3.select('svg').append("circle")
                    .attr("cx", x)
                    .attr("cy", y)
                    .attr("r", 15);

    d3.select('svg').append("circle")
                    .attr("cx", x)
                    .attr("cy", y)
                    .style("fill", "#5e8fd1")
                    .style("fill-opacity", "0.59")
                    .attr("r", 10)
                    .transition()
                    .duration(750)
                    .attr("r", radius);
}

// Gets aspect ratio for SVG Map. Should be same as real aspect ration of building floor.
function getAspectRatio() {
  const origin = d3.select('.origin').filter('path').node().getBBox();
  const originTop = d3.select('.originTop').filter('path').node().getBBox();
  return ((origin.y + origin.height) - originTop.y)/((originTop.x + originTop.width)- origin.x)
}

// Gets aspect ratio for real building floor from meta-data embedded in SVG maps
function getRealAspectRatio() {
  return parseFloat(d3.select('svg').attr('data-height'), 10)/parseFloat(d3.select('svg').attr('data-width'), 10)
}

function mapX (x) {
  const origin = d3.select('.origin').filter('path').node().getBBox();
  const originTop = d3.select('.originTop').filter('path').node().getBBox();
  const in_min = 0;
  const in_max = parseFloat(d3.select('svg').attr('data-width'), 10);
  const out_min = origin.x;
  const out_max = originTop.x + originTop.width;
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function mapY (y) {
  const origin = d3.select('.origin').filter('path').node().getBBox();
  const originTop = d3.select('.originTop').filter('path').node().getBBox();
  const in_min = 0;
  const in_max = parseFloat(d3.select('svg').attr('data-height'), 10);
  const out_min = origin.y + origin.height;
  const out_max = originTop.y;
  return (y - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function setBeacon(x, y, mobile, beacon) {
  if (mobile) {
    if (beacon.building_id !== 64) {
      renderBeacon(mapX(x), mapY(y), beacon);
    } else {
      renderIdeaShopBeacon(mapX(x), mapY(y), beacon);
    }
  } else {
    const newX = mapX(parseFloat(d3.select('svg').attr('data-width'), 10)) - mapX(x);
    if (beacon.building_id !== 64) {
      renderBeacon(mapY(y), newX, beacon);
    } else {
      renderIdeaShopBeacon(mapY(y), newX, beacon);
    }
  }
}