const Hapi        = require('@hapi/hapi');
const config      = require('./config.js')
const songs_bd    = require('./db/songs.js')

const server = new Hapi.Server(config.server);

server.route([
  {
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      const jsondata = {data: songs_bd.songs}
      const data = {name: 'server with music', data: jsondata}
      return data
    }
  },
  {
    method: 'GET',
    path: '/songs',
    handler: (request, h) => {
      const jsondata = {data: songs_bd.songs}
      return jsondata
    }
  },
  {
    method: 'GET',
    path: '/song/{id?}',
    handler: (request, h) => {
      let song = "not id"
      if(request.params.id){
        song = songs_bd.songs.filter( song => song.id == request.params.id );
        song.length ? null : song = "Not Found"
      }
      return song
    }
  },
  {
    method: 'POST',
    path: '/songs/add/',
    handler: (request, h) => {
      songs_bd.songs.push({id: 6, name: request.query.title})
      console.log("song_db: ",songs_bd.songs)
      return "add song"
    }
  },
  {
    method: '*',
    path: '/{any*}',
    handler: (request, h) => {
      return `404 Error! Page "${request.params.any}" Not Found!`;
    }
  }
]);

const launch = async () => {
  try {
    await server.start();
  } catch (err) {
    console.error(err);
    process.exit(1);
  };
  console.log(`Server running at ${server.info.uri}`);
}

launch();
