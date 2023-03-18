const url = 'http://localhost'
const ur_socket = 'ws://localhost'
// const url = 'http://202.149.117.35'
// const ur_socket = 'ws://202.149.117.35'

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