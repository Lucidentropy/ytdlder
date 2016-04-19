

    $(function(){
        var myregexp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;

        $('html').on('paste', function (e) {
            var pasted = e.originalEvent.clipboardData.getData('text');
            var youtubeId = pasted.match(myregexp)[1];
            
            $('#link').val(pasted);

            $.get('/watch?v=' + youtubeId);

        });
    });

function fetch(url){
    javascript:void(window.open('http://localhost:8888/watch?uri='+escape(document.location)));
}