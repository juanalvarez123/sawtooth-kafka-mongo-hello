require('dotenv').config()

const r = require('rethinkdb');

console.log(process.env.RETHINK_HOST, process.env.RETHINK_PORT);

r.connect({
  host: process.env.RETHINK_HOST,
  port: process.env.RETHINK_PORT,
  password: process.env.RETHINK_PASSWORD,
  user: process.env.RETHINK_USER
}).then(async (conn)=>{
    await r.dbList().run(conn).then((tables) => {
        console.log("Tables:", tables);
    })

    await r.dbCreate('it_works').run(conn);


    console.log('connected');
});

