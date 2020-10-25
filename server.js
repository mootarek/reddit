
require('dotenv').config()
var express = require('express');
var bodyParser = require('body-parser');
var expect = require('chai').expect;
var cors = require('cors');
const pool = require('./pg')

var app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.route('/api/threads/:board')
  .get(async (req, res) => {
    try {
      const name = req.params.board;

      const results = await pool.query('select * from board where name = $1',
        [name]
      );
      const board_id = results.rows[0]._id

      const threads = await pool.query('select _id, text, delete_password, reported,created_on, bumped_on from threads where board_id = $1',
        [board_id]
      );

      const replies = await pool.query('select _id, text, delete_password, reported, created_on, thread_id from replies where board_id = $1',
        [board_id]
      );

      const mostRecent = threads.rows
        .sort((a, b) => a.bumped_on - b.bumped_on)
        .map(t => {
          return {
            ...t,
            replies: replies.rows
              .filter(reply => reply.thread_id === t._id)
              .map(reply => {
                return {
                  ...reply,
                  delete_password: undefined,
                  reported: undefined,
                  board_name: name,
                }
              }),
            delete_password: undefined,
            reported: undefined
          }
        })

      res.json({
        threads: mostRecent
      })

    } catch (err) {
      console.log(err);
    }

  })

  .post(async (req, res) => {


    try {
      const results = await pool.query(
        "INSERT INTO board (name) VALUES($1) ON CONFLICT (name) DO NOTHING returning *",
        [req.params.board]
      );
      let sendedBoard;


      if (results.rowCount === 0) {
        const existingDoc = await pool.query(
          "select * from board where name = $1",
          [req.params.board]
        );
        sendedBoard = existingDoc.rows[0]
      } else {
        sendedBoard = results.rows[0]
      }
      if (req.body.hasOwnProperty("text")) {
        const { text, delete_password } = req.body
        const thread = await pool.query(
          "INSERT INTO threads (board_id, text, delete_password) values ($1, $2, $3) returning *",
          [sendedBoard._id, text, delete_password]
        );

        res.json({
          board: sendedBoard,
          thread: thread.rows[0]
        })
      } else {
        res.json({
          board: sendedBoard
        })
      }
    }
    catch (err) {
      console.log(err);
    }
  })
  .put(async (req, res) => {
    const { thread_id } = req.query

    const thread = await pool.query(`UPDATE threads
        SET reported = true
        where _id = $1`, [thread_id]
    );
    if (thread.rowCount > 0) {
      res.json({
        id: thread_id
      })
    } else {
      res.json({
        id: -1
      })
    }
  })
  .delete(async (req, res) => {
    const { delete_password, thread_id } = req.query
    try {
      const thread = await pool.query(`SELECT * FROM threads
      WHERE _id = $1 and delete_password = $2`, [thread_id, delete_password]
      );
      console.log(thread)
      if (thread.rowCount > 0) {
        const thread = await pool.query(`DELETE FROM threads
          WHERE _id = $1`, [thread_id]
        );
          res.json({
            id: thread_id
          })
        } else {
          res.json({
            id: -1
          })
          console.log(-1)
        }
      }
    catch (error) {
      console.error(error)
    }
  })
app.route('/api/replies/:board')
  .get(async (req, res) => {
    const _id = req.query.thread_id

    const thread = await pool.query(`select * from threads where _id = $1`, [_id]);

    const replies = await pool.query(`select * from replies where thread_id = $1`, [_id]);

    const mostRecent = {
      thread: { ...thread.rows[0], 
        replies: replies.rows.map(reply => {
          return {
            ...reply,
            board_name: req.params.board,
            reported: undefined,
            delete_password: undefined
          }
        })
      },

    }

    res.json(mostRecent)

  })
  .post(async (req, res) => {
    const name = req.params.board
    const thread_id = req.query.thread_id
    const { text, delete_password } = req.body

    const results = await pool.query('select * from board where name = $1',
      [name]
    );
    const board_id = results.rows[0]._id

    const reply = await pool.query(`insert into replies (board_id, thread_id, text, delete_password)
      values($1, $2, $3, $4) returning *
      `, [board_id, thread_id, text, delete_password]);

    res.json({
      reply: reply.rows[0]
    })

  })
  .put(async (req, res) => {
    const {reply_id} = req.query

    const reply = await pool.query(`UPDATE replies
        SET reported = true
        where _id = $1 returning *`, [reply_id]
    );
    if (reply.rowCount > 0) {
      res.json({
        id: reply_id
      })
    } else {
      res.json({id: -1})
    }
  })
  .delete(async (req, res) => {
    const reply_id = req.query.reply_id
    const delete_password = req.query.delete_password
    
    const reply = await pool.query(`SELECT * FROM replies
      WHERE _id = $1 , delete_password = $2`, [reply_id, delete_password]
    );
    if (reply.rowCount > 0) {
      const reply = await pool.query(`DELETE FROM replies
          WHERE _id = $1`, [reply_id]
      );
      if (reply.rowCount > 0) {
        res.json({
          id: reply_id
        })
      } else {
        res.json({
          id: -1
        })
      }
    }
  })


 app.get('/api/boards', async (req, res) => {
    const boards = await pool.query('select * from board')
    res.json({
      boards: boards.rows,
      boardCount: boards.rowCount
    })
  })

app.get('/api/:board/check', async (req, res) => {
    const board = await pool.query('select * from board where name = $1', [req.params.board])

    res.json({
      exists: board.rowCount > 0 ? true : false
    })
  })

//Start our server and tests!
app.listen(process.env.PORT || 3000, function () {
    console.log("Listening on port " + process.env.PORT);
    if (process.env.NODE_ENV === 'test') {
      console.log('Running Tests...');
      setTimeout(function () {
        try {
          runner.run();
        } catch (e) {
          var error = e;
          console.log('Tests are not valid:');
          console.log(error);
        }
      }, 1500);
    }
  });

module.exports = app; 
