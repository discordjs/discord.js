$.ajax("http://npm-stat.com/downloads/range/2013-08-21:2100-08-21/discord.js").done(function(cont) {
    var downloadCount = 0;

    for(i in cont.downloads){
        downloadCount += cont.downloads[i].downloads;
    }

    console.log(downloadCount);

    $("#dl-count").html(downloadCount.toLocaleString() + ' downloads');

});
