  var downloadsPath = './downloads';
  var ffmpegPath = './ffmpeg';

  var express = require('express');
  var app = express();
  var fs = require('fs');

  var http = require('http');
  var server = http.createServer(app);
  var io = require('socket.io').listen(server, {
      'log': false
  });
  
  var YoutubeMp3Downloader = require('youtube-mp3-downloader');
  var YD = new YoutubeMp3Downloader({
      "ffmpegPath": ffmpegPath,        // Where is the FFmpeg binary located? 
      "outputPath": downloadsPath,    // Where should the downloaded and encoded files be stored? 
      "youtubeVideoQuality": "highest",       // What video quality should be used? 
      "queueParallelism": 1,                  // How many parallel downloads/encodes should be started? 
      "progressTimeout": 200                 // How long should be the interval of the progress reports 
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
    io.sockets.emit('started');
     
    YD.on("finished", function(data) {
        io.sockets.emit('complete', data);
        //res.send('<script>window.close();</script>');
    });
     
    YD.on("error", function(error) {
        console.log(error);
    });
     
    YD.on("progress", function(progress) {
        console.log('Downloading');
        io.sockets.emit('progress', progress);
    });


  });

var files;
io.sockets.on('connection', function (socket) {
    fs.readdir(downloadsPath, function(err, items) {
      files = items;
    });
    socket.emit('files', files);

      socket.on('disconnect', function () {});
    
  });

  server.listen(8888);
  console.log("Server started on port 8888");