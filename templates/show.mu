<div id="content">
  <h2>Text:</h2>
  <div data-mode="student">
    <textarea></textarea>
    <button class="btn save">Save</button>
  </div>
  <div data-mode="teacher">
    <div class="text"></div>
  </div>
  <div data-mode="view">
    <div class="view"></div>
  </div>
</div>

<div class="fix-right">
  <h3>Mode</h3>
  <div class="btn-group" id="mode">
    <button class="btn btn-primary active" data-mode-control="student">Student</button>
    <button class="btn btn-warning" data-mode-control="teacher">Teacher</button>
    <button class="btn btn-success" data-mode-control="view">View</button>
  </div>

  <div data-mode="teacher">
    <h3>Selection</h3>
    <div id="selection"></div>

    <h3>Tags</h3>
    <div id="tags"></div>
    <div id="new_tag" class="valign">
      <input type="text" class="color form-inline input-mini" placeholder="color" />
      <input type="text" class="text form-inline input-mini" placeholder="text" />
      <button class="btn">Add</button>
    </div>
    <!-- <div style="width: 200px; height: 200px"></div> -->
    <div id="color_joe" style="display: none"></div>
  </div>

  <h3>Annotations</h3>
  <div id="annotations"></div>
  <div data-mode="teacher">
    <button class="btn save">Save</button>
  </div>
  <p><br /><br /></p>
</div>

<script>
var submission, annotation;
var mouse_down = false,
  current_start = -1,
  current_end = -1,
  current_text = '';

head.ready(function() {
  // initialize tags
  tagset = new Tagset();
  tagset.refresh();
  var joe = colorjoe.rgb('color_joe', $('#new_tag .color').val() || 'red');
  joe.on("change", function(color) {
    $('#new_tag button').css({
      'background-image': 'none',
      'background-color': color.hex(),
      'text-shadow': 'none',
      'color': color.lightness() > 0.5 ? 'black' : 'white'
    });
  }).on("done", function(color) {
    $('#new_tag .color').val(color.hex());
    $('#color_joe').hide();
  });

  $('#new_tag .color').click(function() {
    $('#color_joe').show();
  });
  $('#new_tag button').click(function() {
    var new_tag = new Tag($('#new_tag .text').val(), $('#new_tag .color').val());
    tagset.add(new_tag);
  });

  // initialize annotations
  submission = new Submission({{{submission | JSON.stringify}}});
  submission.refresh();

  // initialize mode of UI
  function changeMode(mode) {
    $('[data-mode-control]').removeClass('active');
    $('[data-mode-control="'+ mode +'"]').addClass('active');
    var $data_mode = $('[data-mode]');
    $data_mode.filter('[data-mode~="' + mode + '"]').show();
    $data_mode.not('[data-mode~="' + mode + '"]').hide();

    // init submission values
    localStorage.mode = mode;

    if (mode === 'view') {
      submission.layout();
    }
  }
  $('[data-mode-control]').click(function() {
    changeMode($(this).attr('data-mode-control'));
  });
  changeMode(localStorage.mode || 'student');

  $(document).mousedown(function() {
    mouse_down = true;
    mouseMove();
  }).mouseup(function() {
    mouse_down = false;
    mouseMove();
  }).dblclick(function() {
    mouse_down = true;
    mouseMove();
    mouse_down = false;
  }).mousemove(mouseMove);



  // $('#submit_span').click(function() {
  //   var copy = $.extend({}, span);
  //   copy.label = $('#presup_type').val();
  //   $('#presup_type').val('');

  //   saved_spans.push(copy);
  //   localStorage.saved_spans = JSON.stringify(saved_spans);
  //   displaySavedSpans();
  // });
  // $('#clear_spans').click(function() {
  //   saved_spans = [];
  //   localStorage.saved_spans = JSON.stringify(saved_spans);
  //   displaySavedSpans();
  // });
  // function displaySavedSpans() {
  //   $('#saved_spans').html(JSON.stringify(saved_spans, null, '&nbsp;').replace(/\n/g, '<br>'));
  // }
});
function mouseMove() {
  var text_div = $('#content .text')[0],
      node = text_div.childNodes ? text_div.childNodes[0] : null,
      selection = document.getSelection();

  // account for if the user selects past the end of the box
  if (mouse_down && node && selection.anchorNode == node && selection.focusNode == node) {
    var content = node.textContent,
      start = Math.min(selection.anchorOffset, selection.focusOffset),
      end = Math.max(selection.anchorOffset, selection.focusOffset);

    // leak to the left of the start point if we started in the middle of a word
    var before = content.slice(Math.max(start - 16, 0), start + 1);
    var before_break = before.match(/\b\w+$/)
    if (before_break)
      start -= before_break[0].length - 1;
    // and to the right
    var after = content.slice(end - 1, end + 16);
    var after_break = after.match(/^\w+\b/);
    if (after_break)
      end += after_break[0].length - 1;

    current_start = start;
    current_end = end;
    current_text = content.slice(start, end);

    $('#selection').html(current_text);
    // .shrinkproof()
  }
  else {
    // sthg else selected
  }
}

function Submission(obj) {
  var self = this;
  this._id = obj._id;
  this.text = obj.text;
  this.annotations = obj.annotations;

  // initialize text
  $('textarea').change(function() {
    self.text = $(this).val();
    self.refresh();
    self.dirty();
  });
  $('button.save').click(function() {
    var $button = $(this);
    self.save(function(result) {
      var $flag = $button.flag({html: result.message, fade: 3000});
    });
  });
}
Submission.prototype.refresh = function() {
  var self = this;
  $('textarea').val(this.text);
  $('#content .text').html(this.text);
  $('#annotations').empty();
  this.annotations.forEach(function(anno) {
    var $p = $('<p/>').appendTo('#annotations').click(function(ev) {
      if (ev.metaKey) {
        self.removeAnnotation(anno);
      }
    });
    $('<span>' + anno.tag + '</span>').css('color', anno.color).appendTo($p);
    $p.append(anno.text);
  });
};
Submission.prototype.addAnnotation = function(tag, color) {
  if (current_text) {
    var anno = {
      start: current_start,
      end: current_end,
      text: current_text,
      tag: tag,
      color: color
    };
    this.annotations.push(anno);
    this.refresh();
  }
  else {
    $('#tags').flag({anchor: 'l', text: "You must select some text", fade: 2000});
    return;
  }
  this.dirty();
};
Submission.prototype.removeAnnotation = function(annotation) {
  this.annotations.remove(this.annotations.indexOf(annotation));
  this.refresh();
  this.dirty();
};
Submission.prototype.dirty = function() {
  $('button.save').addClass('btn-inverse');
};
Submission.prototype.save = function(callback) {
  post('/update/' + this._id, this, callback);
  $('button.save').removeClass('btn-inverse');
};
Submission.prototype.annotationsContaining = function(start, end) {
  var containing = [];
  this.annotations.forEach(function(anno) {
    if (anno.start <= start && anno.end >= end) {
      containing.push(anno);
    }
  });
  return containing;
}

Submission.prototype.layout = function() {
  var self = this, dividers = {0: 1}, indices, segments;
  dividers[this.text.length] = 1;
  this.annotations.forEach(function(anno) {
    dividers[anno.start] = 1;
    dividers[anno.end] = 1;
  });
  indices = Object.keys(dividers).map(function(x) { return parseInt(x, 10); });
  indices = indices.sort(function(a, b) { return a - b; });
  segments = _.zip(indices.slice(0, -1), indices.slice(1));

  $('#content .view').empty();
  segments.forEach(function(segment) {
    var start = segment[0], end = segment[1],
      text_segment = self.text.slice(start, end);
    
    var $span = $('<span />').text(text_segment);
    var annos = self.annotationsContaining(start, end);
    annos.forEach(function(anno) {
      $span.css('background-color', anno.color);
    });
    $('#content .view').append($span);
  });
}


function Tagset(tags) {
  this.$container = $('#tags');
  this.load(); // this.tags = [];
}
Tagset.prototype.load = function() {
  try {
    var saved_tags = JSON.parse(localStorage.saved_tags);
    this.tags = saved_tags.map(function(tag) { return new Tag(tag.text, tag.color); });
  }
  catch (exc) {
    console.log("Could not load saved tags, aborting load. " + exc.toString());
    this.tags = [];
  }
};
Tagset.prototype.save = function() {
  localStorage.saved_tags = JSON.stringify(this.tags.map(function(tag) { return tag.toObject(); }));
};
Tagset.prototype.refresh = function() {
  var self = this;
  this.$container.empty();
  this.tags.map(function(tag) {
    var $tag = $('<span class="label" style="background-color: ' + tag.color + '">' + tag.text + '</span>');
    self.$container.append($tag);
    self.$container.append(' ');
    $tag.click(function(ev) {
      if (ev.metaKey)
        self.remove(tag);
      else {
        submission.addAnnotation(tag.text, tag.color);
      }
    });
  })
};
Tagset.prototype.add = function(tag) {
  this.tags.push(tag);
  this.refresh();
  this.save();
};
Tagset.prototype.remove = function(tag) {
  this.tags.remove(this.tags.indexOf(tag));
  this.refresh();
  this.save();
};

function Tag(text, color) {
  this.text = text;
  this.color = color;
}
Tag.prototype.toObject = function() {
  return {text: this.text, color: this.color};
};
</script>
