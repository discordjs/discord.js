class Video {
    constructor(data) {
        this.title = data.snipped.title;
        this.id = data.id.videoId;
        this.url = `https://www.youtube.com/watch?v=${this.id}`;
        this.publishedAt = data.snippet.publishedAt;
        this.channel = {
            title: data.snippet.channelTitle,
            id: data.snippet.channelId,
            description: data.snippet.channelDescription
        };
    }
}

module.exports = Video;
