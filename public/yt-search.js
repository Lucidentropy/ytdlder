function startdownload(youtubeId){
  $('#blackout').show();
  $.get('/watch?v=' + youtubeId);
}

  var downloadedVideoTitles = [];

    $(function(){
        var socket = io.connect(window.location);
        var myregexp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;

        $('html').on('paste', function (e) {
            var pasted = e.originalEvent.clipboardData.getData('text');
            var youtubeId = pasted.match(myregexp)[1];
            $('#video-title').text(pasted);
            startdownload(youtubeId);
        });

        $('#results').on('click', '.link', function(){
            var self = $(this);
            var vidId = self.text();
            var vidTitle = self.parent().find('.title').text();
            $('#video-title').text(vidTitle);

            if ( downloadedVideoTitles.indexOf(vidTitle + '.mp3') > -1) {
                $('#modal h3').text('File with this song name already exists.');
                $('#blackout').fadeIn();
                $('#modal .close').fadeIn();
                return false;
            }

            self.parent().fadeOut();
            startdownload(self.text());
        });

        $('#modal .close').click(function(){
          $('#blackout').fadeOut();
          $(this).hide();
        });

    socket.on('started', function() {
      console.info('Download Started');
      $('#modal h3').text('Download Started');
      $('#blackout').fadeIn();
      
      $("#progress div").width('0%').removeClass('complete');
    });

    socket.on('progress', function(progress) {
      $('#modal h3').text('Downloading');
      var perc = progress.progress.percentage;
      $("#progress div").width(perc + '%');
    });

    socket.on('complete', function(data) {
      $('#progress div').addClass('complete');
      $('#modal h3').text('Download Complete');
      $('#modal .close').fadeIn();
    });

    socket.on('connect', function() {
      console.info('socket.io is connected.');
    });

    socket.on('files', function(vidsArray) {
      downloadedVideoTitles = vidsArray;
    });

$("#search-yt").on("submit", function(e) {
       e.preventDefault();
       var origVal = $('#searchbox').val();
       
       var request = gapi.client.youtube.search.list({
            part: "snippet",
            type: "video",
            q: encodeURIComponent(origVal).replace(/%20/g, "+"),
            maxResults: 10
       }); 
       // execute the request
       $("#searchbox").val('searching...');

       request.execute(function(response) {
          var results = response.result;
          $("#results").empty();
          $.each(results.items, function(index, item) {

            var div = $('<div />');
            div.css('overflow','hidden');
            div.append('<img src="' + item.snippet.thumbnails.default.url + '" />');
            div.append('<p class="title">' + item.snippet.title + '</p>');
            div.append('<p class="link">' + item.id.videoId + '</p>');
            div.append('<p class="description">' + item.snippet.description + '</p>');

            $("#results").append(div);
            $('#searchbox').val(origVal);
          });
       });
    });

    });

    function init() {
        gapi.client.setApiKey(api('NVmnFlPo8wLHM-EtDI48ngJdf21V1XV54EodGEH'));
        gapi.client.load("youtube", "v3", function() {
            // yt api is ready
        });
    }
    

function fetch(url){
    javascript:void(window.open('http://localhost:8888/watch?uri='+escape(document.location)));
}
    var api = function(s){ return s.replace(/[a-zA-Z]/g,function(c){return String.fromCharCode((c<="Z"?90:122)>=(c=c.charCodeAt(0)+13)?c:c-26);}); }