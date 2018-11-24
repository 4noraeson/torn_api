GM_addStyle(`
#x_api {
  background-color: #ead1d1;
  border-radius: 0.5em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin:1em;padding: 0.5em;
  position: fixed;
  right: 0;
  visibility: hidden;
}
#x_api > * {
  padding: 0.3em
}
#x_api strong{
  margin: auto
}
#x_api input{
  text-align: center
}
#x_api_error {
  color: #ead1d1;
  position:fixed;
  right:0;
}
`)

let api_key = localStorage.getItem('x_api_key')

document.querySelector('body').insertAdjacentHTML('afterbegin',`
  <div id="x_api">
    <strong>API Key</strong>
    <input type="text">
    <p></p>
  </div>`
)

document.querySelector('#x_api input').addEventListener('change',(e) => {
  api_key=e.target.value
  torn_api('user..basic').then( (r) => {
    if (r.player_id) {
      localStorage.setItem('x_api_key', api_key)
      document.querySelector('body').removeChild(document.getElementById('x_api'))
    }
    else document.querySelector('#x_api p').innerText = r.error.error
  })
})
if (!api_key) document.querySelector('#x_api').style.visibility = 'visible'

const torn_api = async (args) => {
  const a = args.split('.'); if (a.length!==3) throw(`Bad argument in torn_api(args, key) ${args}`)
  const res = await fetch(`https://api.torn.com/${a[0]}/${a[1]}?selections=${a[2]}&key=${api_key}`)
  const r = await res.json()
  if (r.error) {
    switch (r.error.code) {
      case 1:
      case 2:
        localStorage.removeItem('x_api_key')
        document.querySelector('#x_api').style.visibility = 'visible'
        break
      default:
        break
    }
  }
  return r
}




