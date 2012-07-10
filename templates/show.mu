<div id="content">
  <h2>Text</h2>
  <div data-mode="edit">
    <textarea></textarea>
  </div>
  <div data-mode="annotate">
    <div id="view"></div>
  </div>
</div>

<div class="fix-right">
  <h3>Mode</h3>
  <div class="btn-group" id="mode">
    <button class="btn btn-primary active" data-mode-control="edit">Edit</button>
    <button class="btn btn-success" data-mode-control="annotate">Annotate</button>
  </div>

  <div data-mode="annotate">
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

  <h3>Help</h3>
  <div id="help">
    <div data-mode="edit">
      <p>Type or paste your submission into the box. It will autosave three seconds after adding new input.</p>
    </div>
    <div data-mode="annotate">
      <p>&#8984;+Click an annotation to delete it.</p>
      <p>&#8984;+Click a tag to delete it.</p>
      <p>Enter/return to annotate the current selection with the most recent annotation.</p>
    </div>
  </div>
</div>

<script>
var submission, annotation;
var mouse_down = false,
  current_start = -1,
  current_end = -1,
  current_text = '',
  current_tag = '',
  current_color = '';

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
    var text = $('#new_tag .text').val(),
      color = $('#new_tag .color').val();
    if (text && color) {
      tagset.add(new Tag(text, color));
    }
    else {
      $('#new_tag .color').flag({html: 'You must select a color and label.', anchor: 'l', fade: 3000});
    }
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

    submission.layout();
  }
  $('[data-mode-control]').click(function() {
    changeMode($(this).attr('data-mode-control'));
  });
  changeMode(localStorage.mode || 'edit');

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
});
function mouseMove() {
  // TODO: account for if the user selects past the end of the box
  var sel = document.getSelection();
  if (mouse_down && sel.anchorNode) {
    var div = sel.anchorNode.parentNode.parentNode;
    if (div.id === 'view') {
      var start_span = sel.anchorNode.parentNode,
        end_span = sel.focusNode.parentNode;
        edges = [parseInt(start_span.getAttribute('data-start'), 10) + sel.anchorOffset,
          parseInt(end_span.getAttribute('data-start'), 10) + sel.focusOffset];
      edges = edges.sort(function(a, b) { return a - b; });

      /* NO LEAK
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
      */

      current_start = edges[0];
      current_end = edges[1];
      current_text = submission.text.slice(current_start, current_end);

      $('#selection').html(current_text);
    }
  }
}

function attrfy(obj) {
  var attrs = $.map(obj, function(val, key) { return 'data-' + key + '="' + val + '"'; });
  return attrs.join(' ');
}

function Submission(obj) {
  var self = this;
  this._id = obj._id;
  this.text = obj.text || '';
  this.annotations = obj.annotations || [];

  // initialize text
  $('textarea').on('change keyup', function() {
    self.text = $(this).val();
    self.queueSave(function(result) {
      $('#content textarea').flag({html: result.message, fade: 3000});
    });
    self.refresh();
  });
  $(document).on('keyup', function(ev) {
    if (ev.which === 13) { // enter key
      self.addAnnotation(current_tag, current_color);
    }
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
  this.layout();
};
Submission.prototype.addAnnotation = function(tag, color) {
  current_tag = tag, current_color = color;
  if (current_text && tag && color) {
    var anno = {
      start: current_start,
      end: current_end,
      text: current_text,
      tag: tag,
      color: color
    };
    this.annotations.push(anno);
    this.refresh();
    this.queueSave(function(result) {
      $('#tags').flag({anchor: 'l', html: result.message, fade: 3000});
    });
  }
  else if (!current_text) {
    $('#tags').flag({anchor: 'l', text: "You must select some text", fade: 2000});
  }
  else { // if (!tag || !color)
    $('#tags').flag({anchor: 'l', text: "You must select an annotation", fade: 2000});
  }
};
Submission.prototype.removeAnnotation = function(annotation) {
  this.annotations.remove(this.annotations.indexOf(annotation));
  this.refresh();
  this.queueSave(function(result) {
    $('#tags').flag({anchor: 'l', html: result.message, fade: 3000});
  });
};
Submission.prototype.queueSave = function(callback) {
  var self = this;
  // queueSave calls the callback if the caller wins a timeout race, otherwise, it never gets called
  //   callback signature: POST ajaxy result-dict
  if (this.timeout)
    clearTimeout(this.timeout);
  this.timeout = setTimeout(function() {
    post('/update/' + self._id, self, callback);
  }, 3000);
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

  $('#view').empty();
  segments.forEach(function(segment, i) {
    var start = segment[0], end = segment[1],
      text_segment = self.text.slice(start, end);
    
    var $span = $('<span '  + attrfy({start: start, end: end, i: i}) + '">' + text_segment + '</span>');
    self.annotationsContaining(start, end).forEach(function(anno) {
      $span.css('background-color', anno.color);
    });
    $('#view').append($span);
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
    if (localStorage.saved_tags === undefined) {
      // '#330099', '#990099', '#ccff00', '#ff0000'
      // defaults
      console.log("No saved tags, loading some defaults");
      this.tags = [
        new Tag('Vocab', '#00cc00'),
        new Tag('Spelling', '#0066b3'),
        new Tag('Word Choice', '#ff8000'),
        new Tag('Awkward', '#ffcc00')
      ];
    }
    else {
      console.log("Could not load saved tags, aborting load. " + exc.toString());
    }
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
      if (ev.metaKey) {
        self.remove(tag);
      }
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
