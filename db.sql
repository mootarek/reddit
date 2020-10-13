


CREATE TABLE board (
    _id SERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE threads (
	_id SERIAL NOT NULL PRIMARY KEY,
    board_id INT NOT NULL REFERENCES board(_id),
	text VARCHAR(255) NOT NULL,
	delete_password VARCHAR(255) NOT NULL,
	reported  BOOLEAN NOT NULL DEFAULT FALSE ,
	created_on DATE NOT NULL DEFAULT CURRENT_DATE,
    bumped_on DATE  DEFAULT CURRENT_DATE
);

CREATE TABLE replies (
   _id SERIAL PRIMARY KEY NOT NULL,
   thread_id INT NOT NULL REFERENCES threads(_id),
   board_id INT NOT NULL REFERENCES replies(_id),
   text VARCHAR(255) NOT NULL,
   delete_password VARCHAR(255) NOT NULL,
   reported  BOOLEAN NOT NULL DEFAULT FALSE,
   created_on DATE NOT NULL DEFAULT CURRENT_DATE
);


select *
from restaurants
    left join(
        select restaurant_id,
            count(*),
            TRUNC(AVG(rating, 1)) as average_rating
        from reviews
        group by restaurant_id
    ) reviews on restaurants.id = reviews.restaurant_id;


    insert into board (name) values ('popps');


    insert into replies
    ( thread_id ,text , board_id, delete_password) values (1, 'hi', '1', 1);
 
 select 
 thd._id, thd.text , thd.reported, thd.delete_password ,thd.created_on,thd.bumped_on as threads,
 reps._id, reps.text , reps.reported, reps.delete_password ,reps.created_on as replies 
 from threads thd left OUTER join replies reps 
 on thd._id = reps.thread_id 
 where thd.board_id = 1
 order by thd.created_on DESC
 LIMIT 10;