<script>
$('.tablesorter').tablesorter();
var flash = window.location.search.match(/[?&]flash=([^?&]+)/);
if (flash)
  $('#navbar h2').flag({text: flash[1].replace(/\+/g, ' ')});
$(document).on('click', 'a[data-method=DELETE]', function(ev) {
  ev.preventDefault();
  var $a = $(this);
  post($a.attr('href'), function(data) {
    console.log(data);
    $a.flag({text: data.message});
  });
});
</script>
