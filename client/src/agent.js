import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';

const superagent = superagentPromise(_superagent, global.Promise);

const API_ROOT = 'http://localhost:5000/api';

const encode = encodeURIComponent;
const responseBody = res => res.body;
const responseData = res => res.body;
// let token = null;
// const tokenPlugin = req => {
//   if (token) {
//     req.set('authorization', `Token ${token}`);
//   }
// }

const requests = {
  del: url =>
    superagent.del(`${API_ROOT}${url}`).then(responseBody),
  get: url =>
    superagent.get(`${API_ROOT}${url}`).then(responseData),
  put: (url, body) =>
    superagent.put(`${API_ROOT}${url}`, body).then(responseBody),
  post: (url, body) =>
    superagent.post(`${API_ROOT}${url}`, body).then(responseBody)
};

const Boards = {
  getAll: () =>
    requests.get('/boards'),
  check : (query) => 
    requests.get(`/${query}/check`)
  
};
const Threads = {
  getAll: (board) =>
    requests.get(`/threads/${board}`),
    get: (board, thread_id, reply_id) =>
    requests.get(`/replies/${board}?thread_id=${encode(thread_id)}`),
    post: (board, body) =>
    requests.post(`/threads/${board}`, body),
    put: (board, thread_id) =>
    requests.put(`/threads/${board}?thread_id=${encode(thread_id)}`),
    delete: (board, thread_id, delete_password) =>
    requests.del(`/threads/${board}?thread_id=${encode(thread_id)}&delete_password=${encode(delete_password)}`)
  
};

const Replies = {
    post: (board, thread_id, body, ) =>
    requests.post(`/replies/${board}?thread_id=${encode(thread_id)}`, body),
    put: (board, reply_id) =>
    requests.put(`/replies/${board}?reply_id=${encode(reply_id)}`),
    delete: (board, reply_id) =>
    requests.delete(`/replies/${board}?reply_id=${encode(reply_id)}`)
  
};


 export default {
  Threads,
  Boards,
  Replies,
  agent: requests,

};
