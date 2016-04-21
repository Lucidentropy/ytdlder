

    $(function(){

        var myregexp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;

        $('html').on('paste', function (e) {
            var pasted = e.originalEvent.clipboardData.getData('text');
            var youtubeId = pasted.match(myregexp)[1];
            
            $('#link').val(pasted);

            $.get('/watch?v=' + youtubeId);

        });

        $('#results').on('click', '.link', function(){
            console.log('fetching');
            var self = $(this);
            self.parent().fadeOut();

            $.get('/watch?v=' + self.text());

        });



$("#search-yt").on("submit", function(e) {
       e.preventDefault();
       
       var request = gapi.client.youtube.search.list({
            part: "snippet",
            type: "video",
            q: encodeURIComponent($("#youtube-search").val()).replace(/%20/g, "+"),
            maxResults: 10,
            order: "viewCount"
       }); 
       // execute the request
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