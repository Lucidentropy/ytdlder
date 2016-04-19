  var express = require('express');
  var app = express();
  var YoutubeMp3Downloader = require('youtube-mp3-downloader');
  var YD = new YoutubeMp3Downloader({
      "ffmpegPath": "./ffmpeg",        // Where is the FFmpeg binary located? 
      "outputPath": "./downloads",    // Where should the downloaded and encoded files be stored? 
      "youtubeVideoQuality": "highest",       // What video quality should be used? 
      "queueParallelism": 2,                  // How many parallel downloads/encodes should be started? 
      "progressTimeout": 2000                 // How long should be the interval of the progress reports 
  });

  app.use(express.static('public')); // document root
  
  app.use('/watch', function (req, res) {
    var videoId;
    if ( typeof req.query.v !== "undefined" ) {
      videoId = req.query.v;
    } else if ( typeof req.query.uri !== "undefined" ) {
      var youtuberegexp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
      console.log(req.query.uri)
      videoId = req.query.uri.match(youtuberegexp)[1];
    } else {
      console.log('Didn\'t get video id or uri');
      return false;
    }
    if ( videoId === undefined ) { 
      console.log('Video Id was undefined, exiting');
      return false;
    }
    console.log('Downloading video id : '  + videoId);

    YD.download(videoId);
     
    YD.on("finished", function(data) {
        console.log('DOWNLOAD COMPLETE');
        console.log(data.videoId);
        console.log(data.videoTitle);
        console.log(data.file);

        res.send('<script>window.close();</script>');
    });
     
    YD.on("error", function(error) {
        console.log(error);
    });
     
    YD.on("progress", function(progress) {
        console.log('Downloading');
    });


  });

  app.listen(8888);
  console.log("Server started");