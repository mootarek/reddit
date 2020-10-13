
const pool = require('../pg')

module.exports = function (app) {

  // _id, text, created_on(date&time), bumped_on(date&time, starts same as created_on), reported(boolean), delete_password,
  // table for every board



  app.route('/api/threads/:board')
    .get(async (req, res) => {

      try {

        let name = req.params.board;

        const results = await pool.query('select * from board where name = $1',
          [name]
        );
        const board_id = results.rows[0]._id

        const threads = await pool.query('select _id, text, delete_password, reported,created_on, bumped_on from threads where board_id = 1'
      );

      const replies = await pool.query('select _id, text, delete_password, reported, created_on, thread_id from replies where board_id = 1'
    );

    const mostRecent = threads.rows
    .sort((a, b) => a.bumped_on - b.bumped_on)
    .slice(0,10)
    .map(b => {
      return {
        ...b,
        replies: replies.rows
        .filter(reply => reply.thread_id === b._id)
        .map(reply => {
          return {
            ...reply,
            delete_password: undefined,
            reported: undefined
          }
        })
        .sort((a, b) => b.created_on - a.created_on).slice(0, 3),
        replycount:replies.rows
        .filter(reply => reply.thread_id === b._id).length,
        delete_password: undefined,
        reported: undefined
      }
    })

     res.json(mostRecent)
     console.log(mostRecent)

      } catch (err) {
        console.log(err);
      }

    })

    .post(async (req, res) => {
      const { text, delete_password } = req.body

      try {
        const results = await pool.query(
          "INSERT INTO board (name) VALUES($1) ON CONFLICT (name) DO NOTHING returning *",
          [req.params.board]
        );

        let boardname;
        let board_id;


        if (results.rowCount === 0) {
          const existingDoc = await pool.query(
            "select * from board where name = $1",
            [req.params.board]
          );
          boardname = existingDoc.rows[0].name
          board_id = existingDoc.rows[0]._id
        } else {
          boardname = results.rows[0].name
          board_id = results.rows[0]._id
        }

        const thread = await pool.query(
          "INSERT INTO threads (board_id, text, delete_password) values ($1, $2, $3) returning *",
          [board_id, text, delete_password]
        );
        const thread_id = thread.rows[0]._id

        console.log('success')

        res.redirect(`/b/${boardname}/${thread_id}`)


      } catch (err) {
        console.log(err);
      }
    })
    .put(async (req, res) => {
      const name = req.params.board
      const _id = req.query.threads

        const thread = await pool.query(`UPDATE threads
        SET reported = true
        WHERE condition; from threads where _id = $1 returning *`, [_id]
      );

      if(thread.rows[0].reported === true) {
        res.send('success')
      }else {
        throw new Error('The Id is wrong')
      }
    })
    .delete(async (req, res) => {
      const name = req.params.board
      const _id = req.query.threads

        const thread = await pool.query(`DELETE FROM threads
        WHERE _id = $1; *`, [_id]
      );
    })
  app.route('/api/replies/:name')
    .get(async (req, res) => {
      const _id = req.query.threads

      const thread = await pool.query(`select * from threads where _id = $1`, [_id]);
      
      const replies = await pool.query(`select * from replies where thread_id = $1`, [_id]);


      res.json({
        ...thread,
        replies: replies.rows.map(reply => {
          return {
            ...reply,
            reported: undefined,
            delete_password: undefined
          }
        })
      })

    })
    .post((req, res) => {
      const name = req.params.board

      
    })
    .put((req, res) => {
      const name = req.params.board
    })
    .delete((req, res) => {
      const name = req.params.board
    })


}



  //       const threads = await pool.query(`SELECT thd._id,
  //         thd.text,
  //         thd.delete_password,
  //         thd.reported,
  //         thd.created_on,
  //         thd.bumped_on,
  //         r.*
  //  FROM (SELECT *
  //        FROM threads
  //        WHERE board_id = 1
  //        ORDER BY created_on DESC
  //        LIMIT 10) AS thd
  //     CROSS JOIN LATERAL
  //        (SELECT * FROM replies
  //         WHERE thread_id = thd._id
  //         ORDER BY created_on DESC
  //         LIMIT 3) AS r`)

