/*global $ */
$(document).ready(function() {
  $('.deleteComplaint').on('click', function() {
    let roomNumber = $(this).siblings('.adminRoomNumber').text().replace(/(\r\n\t|\n|\r\t)/gm,"");
    $.ajax({
      url: '/admin/stuart',
      type: 'DELETE',
      data: { roomNumber, id: $(this).data('id')},
      success: (result) => {
        if (result.error === 'false') {
          let toRemove = $(this).parent().parent().parent();
          toRemove.hide(400, function () {
            toRemove.remove();
          });
        }
      }
    });
  });
});