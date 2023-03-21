// const url = 'http://localhost'
// const ur_socket = 'ws://localhost'
let chk = true
const url = chk == true ? 'http://202.149.117.35' : 'http://localhost'
const ur_socket = chk == true ? 'ws://202.149.117.35' : 'ws://localhost'

// const port = '3002'
const port = '3001'
const port_img = '3003'
const port_socket = '3000'
// const port = '3006'
export default {
    backend_url: `${url}:${port}`,
    backend_url_img: `${url}:${port_img}`,
    backend_url_socket: `${ur_socket}:${port_socket}`,
    // background_noti : `ws://localhost:3020`,
    // background_data : `ws://localhost:3081`,
    token_map: 'pk.eyJ1IjoidG9uZ3p6enoiLCJhIjoiY2s5N3ZuM3hiMGVzYTNncGt6cnVrZHE4eiJ9.jh_uPx9BkdNpdG1LdhenUw'
} 